import dbStore from '../services/dbStore.js';
import aiService from '../services/aiService.js';

/**
 * 1. Create a new interview session
 * Generates tailored questions based on role, level, mode, skills, difficulty
 */
export const createSession = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const {
      role = 'Frontend Developer',
      experienceLevel = 'Fresher / Entry Level',
      interviewMode = 'technical', // technical, behavioral, coding, mixed
      interactionMode = 'text', // voice, text
      skills = [],
      questionCount = 3,
      difficulty = 'Medium',
      title
    } = req.body;

    const count = Math.min(10, Math.max(1, parseInt(questionCount, 10) || 3));

    // Call AI Service (LLM or simulation engine) to generate realistic questions
    const generatedQuestions = await aiService.generateQuestions({
      role,
      experienceLevel,
      interviewMode,
      skills,
      count,
      difficulty
    });

    const sessionTitle =
      title ||
      `${role} ${
        interviewMode === 'behavioral'
          ? 'HR & Behavioral'
          : interviewMode === 'coding'
          ? 'Coding Challenge'
          : 'Technical'
      } Mock Interview`;

    const newSession = await dbStore.createSession({
      userId,
      title: sessionTitle,
      role,
      experienceLevel,
      interviewMode,
      interactionMode,
      skills,
      difficulty,
      status: 'in-progress',
      currentQuestionIndex: 0,
      questions: generatedQuestions,
      startedAt: new Date().toISOString(),
      totalDurationSeconds: 0,
      overallFeedback: {
        overallScore: 0,
        technicalReadiness: 0,
        communicationScore: 0,
        problemSolvingScore: 0,
        strengthsSummary: [],
        weaknessesSummary: [],
        actionableTips: [],
        recommendation: 'In Progress',
        summaryText: ''
      }
    });

    return res.status(201).json({
      success: true,
      session: newSession
    });
  } catch (err) {
    console.error('Error creating interview session:', err);
    return res.status(500).json({ success: false, message: 'Failed to create interview session.' });
  }
};

/**
 * 2. Get session details by ID
 */
export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await dbStore.findSessionById(id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found.' });
    }

    const userId = req.user._id || req.user.id;
    if (session.userId !== userId && session.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this session.' });
    }

    return res.json({ success: true, session });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving session.' });
  }
};

/**
 * 3. Submit an answer for a specific question in the session
 * Runs AI evaluation and updates question state
 */
export const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      questionId,
      candidateAnswer = '',
      candidateCode = '',
      codeLanguage = 'javascript',
      timeTakenSeconds = 0
    } = req.body;

    const session = await dbStore.findSessionById(id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const questionIndex = session.questions.findIndex((q) => q.id === questionId || q._id === questionId);
    if (questionIndex === -1) {
      return res.status(404).json({ success: false, message: 'Question not found in this session.' });
    }

    const currentQ = session.questions[questionIndex];

    // Evaluate answer with AI Service
    const evaluation = await aiService.evaluateAnswer({
      question: currentQ,
      candidateAnswer,
      candidateCode,
      codeLanguage,
      timeTakenSeconds,
      role: session.role,
      experienceLevel: session.experienceLevel,
      interviewMode: session.interviewMode
    });

    // Update the question
    session.questions[questionIndex].candidateAnswer = candidateAnswer;
    session.questions[questionIndex].candidateCode = candidateCode;
    session.questions[questionIndex].codeLanguage = codeLanguage;
    session.questions[questionIndex].timeTakenSeconds = timeTakenSeconds;
    session.questions[questionIndex].answeredAt = new Date().toISOString();
    session.questions[questionIndex].evaluation = evaluation;

    // Advance question index if there are more questions
    if (session.currentQuestionIndex < session.questions.length - 1) {
      session.currentQuestionIndex += 1;
    }

    session.totalDurationSeconds = (session.totalDurationSeconds || 0) + timeTakenSeconds;

    const updated = await dbStore.updateSession(id, {
      questions: session.questions,
      currentQuestionIndex: session.currentQuestionIndex,
      totalDurationSeconds: session.totalDurationSeconds
    });

    return res.json({
      success: true,
      evaluation,
      session: updated
    });
  } catch (err) {
    console.error('Error submitting answer:', err);
    return res.status(500).json({ success: false, message: 'Error evaluating and submitting answer.' });
  }
};

/**
 * 4. Request progressive hint for current question
 */
export const requestHint = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionId } = req.body;

    const session = await dbStore.findSessionById(id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const q = session.questions.find((item) => item.id === questionId || item._id === questionId);
    if (!q) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    const hints = q.hints || [
      'Think about the core data flow and lifecycle stages.',
      'Consider the computational complexity and memory footprint.'
    ];

    const currentUsage = q.hintsUsed || 0;
    const nextHint = hints[currentUsage] || hints[hints.length - 1];

    q.hintsUsed = currentUsage + 1;
    await dbStore.updateSession(id, { questions: session.questions });

    return res.json({
      success: true,
      hint: nextHint,
      hintNumber: currentUsage + 1,
      totalHintsAvailable: hints.length
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching hint.' });
  }
};

/**
 * 5. Run code simulation against test cases
 */
export const runCode = async (req, res) => {
  try {
    const { code, language = 'javascript', testCases = [] } = req.body;
    const result = aiService.runCodeSimulation({ code, language, testCases });
    return res.json({ success: true, result });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to run code simulation.' });
  }
};

/**
 * 6. Complete session and generate overall AI analysis
 */
export const completeSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await dbStore.findSessionById(id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    // Generate comprehensive evaluation summary across all answered questions
    const overallFeedback = await aiService.generateOverallFeedback(session);

    const updated = await dbStore.updateSession(id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      overallFeedback
    });

    return res.json({
      success: true,
      session: updated
    });
  } catch (err) {
    console.error('Error completing session:', err);
    return res.status(500).json({ success: false, message: 'Error finalizing interview session.' });
  }
};

/**
 * 7. Get past interview sessions for the logged-in user
 */
export const getUserSessions = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { status, role } = req.query;

    const sessions = await dbStore.findSessionsByUserId(userId, { status, role });
    return res.json({
      success: true,
      count: sessions.length,
      sessions
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving user sessions.' });
  }
};

/**
 * 8. Delete an interview session
 */
export const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    await dbStore.deleteSession(id);
    return res.json({ success: true, message: 'Session deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error deleting session.' });
  }
};

/**
 * 9. Clear all interview history for user
 */
export const clearUserHistory = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    await dbStore.clearSessionsByUserId(userId);
    return res.json({ success: true, message: 'All interview sessions cleared successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error clearing history.' });
  }
};

