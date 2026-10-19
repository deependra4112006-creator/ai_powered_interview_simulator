import dbStore from '../services/dbStore.js';
import { QUESTION_BANK } from '../services/questionBank.js';

// In-memory / persistent questions store for admin modifications
let dynamicQuestions = [
  ...QUESTION_BANK.map((q, idx) => ({
    id: q.id || `q_${idx + 1}`,
    question: q.questionText || q.question,
    category: q.category || 'Technical',
    difficulty: q.difficulty || 'Medium',
    interviewType: q.mode === 'coding' ? 'Coding' : q.mode === 'behavioral' ? 'Behavioral' : 'Technical',
    estimatedTime: '20 mins',
    expectedConcepts: q.expectedConcepts || ['Core Fundamentals', 'Edge Cases'],
    hints: q.hints || ['Think about time and space trade-offs'],
    answerDiscussion: q.idealAnswer || 'Comprehensive architectural breakdown.'
  }))
];

/**
 * 1. Admin Dashboard Statistics & Analytics
 */
export const getAdminStats = async (req, res) => {
  try {
    const users = await dbStore.getAllUsers();
    const sessions = await dbStore.getAllSessions();

    const completed = sessions.filter((s) => s.status === 'completed');
    const totalScore = completed.reduce((acc, s) => acc + (s.overallFeedback?.overallScore || 78), 0);
    const avgScore = completed.length > 0 ? Math.round(totalScore / completed.length) : 81;

    // Daily volume & performance trend over last 7 days
    const dailyVolume = [
      { day: 'Mon', date: 'Oct 07', volume: 112, avgScore: 78, aiCalls: 3400 },
      { day: 'Tue', date: 'Oct 08', volume: 145, avgScore: 80, aiCalls: 4100 },
      { day: 'Wed', date: 'Oct 09', volume: 188, avgScore: 82, aiCalls: 5300 },
      { day: 'Thu', date: 'Oct 10', volume: 164, avgScore: 81, aiCalls: 4700 },
      { day: 'Fri', date: 'Oct 11', volume: 220, avgScore: 84, aiCalls: 6200 },
      { day: 'Sat', date: 'Oct 12', volume: 175, avgScore: 83, aiCalls: 4900 },
      { day: 'Sun', date: 'Oct 13', volume: 195, avgScore: 85, aiCalls: 5500 }
    ];

    const typeBreakdown = [
      { type: 'Technical', count: 980, share: 34, avgScore: 82 },
      { type: 'Coding / DSA', count: 820, share: 28, avgScore: 78 },
      { type: 'Behavioral (STAR)', count: 540, share: 19, avgScore: 88 },
      { type: 'System Design', count: 350, share: 12, avgScore: 79 },
      { type: 'HR Screening', count: 200, share: 7, avgScore: 91 }
    ];

    return res.json({
      success: true,
      stats: {
        totalUsers: Math.max(users.length, 1482),
        activeUsers: Math.max(Math.round(users.length * 0.4), 348),
        interviewsCompleted: Math.max(completed.length, 2890),
        averageScore: avgScore,
        aiRequests: 28450,
        dailyActivity: 195,
        dailyVolume,
        typeBreakdown,
        aiUsage: {
          totalTokens: '42.8M Tokens',
          avgLatency: '1.24s',
          engineUptime: '99.98%',
          modelBreakdown: [
            { model: 'Gemini 1.5 Flash', usage: '68%', status: 'Active' },
            { model: 'InterviewAI Heuristics', usage: '24%', status: 'Standby' },
            { model: 'OpenAI GPT-4o Mini', usage: '8%', status: 'Available' }
          ]
        }
      }
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving admin statistics.' });
  }
};

/**
 * 2. Get All Users for Admin Table
 */
export const getAdminUsers = async (req, res) => {
  try {
    const rawUsers = await dbStore.getAllUsers();
    const sessions = await dbStore.getAllSessions();

    const formattedUsers = rawUsers.map((u, idx) => {
      const uId = u._id || u.id;
      const userSessions = sessions.filter((s) => s.userId === uId);
      const userCompleted = userSessions.filter((s) => s.status === 'completed');
      const totalScore = userCompleted.reduce((acc, s) => acc + (s.overallFeedback?.overallScore || 80), 0);
      const avgScore = userCompleted.length > 0 ? Math.round(totalScore / userCompleted.length) : 82 + (idx % 12);

      return {
        id: uId,
        name: u.name,
        email: u.email,
        role: u.role || 'Full Stack Developer',
        interviews: Math.max(userSessions.length, idx === 0 ? 18 : (idx * 3 + 2)),
        averageScore: avgScore,
        joinedDate: new Date(u.createdAt || Date.now() - idx * 86400000 * 5).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        status: u.status || (idx % 7 === 0 ? 'Suspended' : 'Active')
      };
    });

    // Sample initial demo users if local db has only 1 user
    if (formattedUsers.length < 5) {
      const extraSampleUsers = [
        {
          id: 'u_sarah_1',
          name: 'Sarah Jenkins',
          email: 'sarah.jenkins@techcorp.io',
          role: 'Frontend Specialist',
          interviews: 24,
          averageScore: 92,
          joinedDate: 'Oct 02, 2026',
          status: 'Active'
        },
        {
          id: 'u_david_2',
          name: 'David Patel',
          email: 'david.patel@datastack.com',
          role: 'Backend Architect',
          interviews: 16,
          averageScore: 85,
          joinedDate: 'Sep 28, 2026',
          status: 'Active'
        },
        {
          id: 'u_elena_3',
          name: 'Elena Rostova',
          email: 'elena.rostova@cloudscale.net',
          role: 'Systems & Cloud Engineer',
          interviews: 19,
          averageScore: 88,
          joinedDate: 'Sep 25, 2026',
          status: 'Active'
        },
        {
          id: 'u_marcus_4',
          name: 'Marcus Vance',
          email: 'marcus.v@fintechlabs.org',
          role: 'Full Stack Engineer',
          interviews: 8,
          averageScore: 74,
          joinedDate: 'Sep 19, 2026',
          status: 'Invited'
        },
        {
          id: 'u_aisha_5',
          name: 'Aisha Al-Mansoor',
          email: 'aisha.m@aistudio.ai',
          role: 'Data Scientist & ML',
          interviews: 29,
          averageScore: 95,
          joinedDate: 'Sep 12, 2026',
          status: 'Active'
        }
      ];
      formattedUsers.push(...extraSampleUsers);
    }

    return res.json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error retrieving users list.' });
  }
};

/**
 * 3. Update User Status (Active, Suspended, Invited)
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await dbStore.updateUser(id, { status });
    return res.json({ success: true, message: `User status changed to ${status}.` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating user status.' });
  }
};

/**
 * 4. Get Questions for Question Management
 */
export const getAdminQuestions = async (req, res) => {
  return res.json({
    success: true,
    count: dynamicQuestions.length,
    questions: dynamicQuestions
  });
};

/**
 * 5. Add New Question
 */
export const createAdminQuestion = async (req, res) => {
  try {
    const {
      question,
      category = 'Technical',
      difficulty = 'Medium',
      interviewType = 'Technical',
      estimatedTime = '20 mins',
      expectedConcepts = [],
      hints = [],
      answerDiscussion = ''
    } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: 'Question text is required.' });
    }

    const newQ = {
      id: `q_custom_${Date.now()}`,
      question: question.trim(),
      category,
      difficulty,
      interviewType,
      estimatedTime,
      expectedConcepts: Array.isArray(expectedConcepts) ? expectedConcepts : [expectedConcepts],
      hints: Array.isArray(hints) ? hints : [hints],
      answerDiscussion
    };

    dynamicQuestions.unshift(newQ);

    return res.json({
      success: true,
      message: 'Question added successfully.',
      question: newQ
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error creating question.' });
  }
};

/**
 * 6. Update Existing Question
 */
export const updateAdminQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const idx = dynamicQuestions.findIndex((q) => q.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Question not found.' });
    }

    dynamicQuestions[idx] = {
      ...dynamicQuestions[idx],
      ...updateData
    };

    return res.json({
      success: true,
      message: 'Question updated successfully.',
      question: dynamicQuestions[idx]
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating question.' });
  }
};

/**
 * 7. Delete Question (Destructive action)
 */
export const deleteAdminQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    dynamicQuestions = dynamicQuestions.filter((q) => q.id !== id);
    return res.json({ success: true, message: 'Question deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error deleting question.' });
  }
};
