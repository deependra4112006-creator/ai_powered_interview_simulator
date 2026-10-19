import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  questionText: { type: String, required: true },
  category: { type: String, default: 'Technical' }, // Technical, Behavioral, Coding, Architecture
  difficulty: { type: String, default: 'Medium' }, // Easy, Medium, Hard
  expectedConcepts: [String],
  hints: [String],
  starterCode: { type: String, default: '' },
  testCases: [
    {
      input: String,
      expectedOutput: String,
      description: String,
    }
  ],
  idealAnswer: { type: String, default: '' },
  candidateAnswer: { type: String, default: '' },
  candidateCode: { type: String, default: '' },
  codeLanguage: { type: String, default: 'javascript' },
  timeTakenSeconds: { type: Number, default: 0 },
  answeredAt: { type: Date },
  hintsUsed: { type: Number, default: 0 },
  evaluation: {
    score: { type: Number, default: 0 },
    relevance: { type: Number, default: 0 },
    technicalDepth: { type: Number, default: 0 },
    clarity: { type: Number, default: 0 },
    starScore: { type: Number, default: 0 },
    codeQuality: { type: Number, default: 0 },
    timeEfficiency: { type: Number, default: 0 },
    strengths: [String],
    improvements: [String],
    feedbackText: { type: String, default: '' },
    evaluatedAt: { type: Date },
  },
});

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  experienceLevel: {
    type: String,
    required: true,
  },
  interviewMode: {
    type: String,
    enum: ['technical', 'behavioral', 'coding', 'mixed'],
    default: 'technical',
  },
  interactionMode: {
    type: String,
    enum: ['voice', 'text'],
    default: 'text',
  },
  skills: [String],
  difficulty: {
    type: String,
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress',
  },
  currentQuestionIndex: {
    type: Number,
    default: 0,
  },
  questions: [questionSchema],
  overallFeedback: {
    overallScore: { type: Number, default: 0 },
    technicalReadiness: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    problemSolvingScore: { type: Number, default: 0 },
    strengthsSummary: [String],
    weaknessesSummary: [String],
    actionableTips: [String],
    recommendation: { type: String, default: 'Ready to Practice' },
    summaryText: { type: String, default: '' },
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
  totalDurationSeconds: {
    type: Number,
    default: 0,
  },
});

export const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
export default InterviewSession;
