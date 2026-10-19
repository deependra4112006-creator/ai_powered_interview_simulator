import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import InterviewSession from '../models/InterviewSession.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'db.json');

// Initialize local JSON storage if not present
const getLocalData = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initial = { users: [], sessions: [] };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content || '{"users":[],"sessions":[]}');
  } catch (err) {
    console.error('Error reading local JSON db:', err.message);
    return { users: [], sessions: [] };
  }
};

const saveLocalData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing local JSON db:', err.message);
  }
};

const isMongooseActive = () => mongoose.connection.readyState === 1;

export const dbStore = {
  // USERS
  async findUserByEmail(email) {
    if (isMongooseActive()) {
      return await User.findOne({ email: email.toLowerCase() });
    }
    const data = getLocalData();
    return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async findUserById(id) {
    if (isMongooseActive()) {
      return await User.findById(id);
    }
    const data = getLocalData();
    return data.users.find((u) => u._id === id || u.id === id) || null;
  },

  async createUser(userData) {
    if (isMongooseActive()) {
      const newUser = new User(userData);
      return await newUser.save();
    }
    const data = getLocalData();
    const newUser = {
      _id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    data.users.push(newUser);
    saveLocalData(data);
    return newUser;
  },

  async updateUser(id, updateData) {
    if (isMongooseActive()) {
      return await User.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    }
    const data = getLocalData();
    const idx = data.users.findIndex((u) => u._id === id || u.id === id);
    if (idx !== -1) {
      data.users[idx] = { ...data.users[idx], ...updateData };
      saveLocalData(data);
      return data.users[idx];
    }
    return null;
  },

  async getAllUsers() {
    if (isMongooseActive()) {
      return await User.find({}).sort({ createdAt: -1 });
    }
    const data = getLocalData();
    return data.users;
  },

  async getAllSessions() {
    if (isMongooseActive()) {
      return await InterviewSession.find({}).sort({ startedAt: -1 });
    }
    const data = getLocalData();
    return data.sessions;
  },

  // SESSIONS
  async createSession(sessionData) {
    if (isMongooseActive()) {
      const newSession = new InterviewSession(sessionData);
      return await newSession.save();
    }
    const data = getLocalData();
    const newSession = {
      _id: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      ...sessionData,
      startedAt: new Date().toISOString(),
      currentQuestionIndex: sessionData.currentQuestionIndex || 0,
      status: sessionData.status || 'in-progress',
    };
    data.sessions.unshift(newSession);
    saveLocalData(data);
    return newSession;
  },

  async findSessionById(id) {
    if (isMongooseActive()) {
      return await InterviewSession.findById(id);
    }
    const data = getLocalData();
    return data.sessions.find((s) => s._id === id || s.id === id) || null;
  },

  async updateSession(id, updateData) {
    if (isMongooseActive()) {
      return await InterviewSession.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    }
    const data = getLocalData();
    const idx = data.sessions.findIndex((s) => s._id === id || s.id === id);
    if (idx !== -1) {
      data.sessions[idx] = {
        ...data.sessions[idx],
        ...updateData,
      };
      saveLocalData(data);
      return data.sessions[idx];
    }
    return null;
  },

  async findSessionsByUserId(userId, { status, role } = {}) {
    if (isMongooseActive()) {
      const query = { userId };
      if (status) query.status = status;
      if (role) query.role = role;
      return await InterviewSession.find(query).sort({ startedAt: -1 });
    }
    const data = getLocalData();
    return data.sessions
      .filter((s) => {
        if (s.userId !== userId) return false;
        if (status && s.status !== status) return false;
        if (role && s.role !== role) return false;
        return true;
      })
      .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
  },

  async deleteSession(id) {
    if (isMongooseActive()) {
      return await InterviewSession.findByIdAndDelete(id);
    }
    const data = getLocalData();
    const initialLen = data.sessions.length;
    data.sessions = data.sessions.filter((s) => s._id !== id && s.id !== id);
    saveLocalData(data);
    return data.sessions.length < initialLen;
  },

  async clearSessionsByUserId(userId) {
    if (isMongooseActive()) {
      return await InterviewSession.deleteMany({ userId });
    }
    const data = getLocalData();
    data.sessions = data.sessions.filter((s) => s.userId !== userId);
    saveLocalData(data);
    return true;
  },

  async deleteUser(userId) {
    if (isMongooseActive()) {
      await InterviewSession.deleteMany({ userId });
      return await User.findByIdAndDelete(userId);
    }
    const data = getLocalData();
    data.sessions = data.sessions.filter((s) => s.userId !== userId);
    data.users = data.users.filter((u) => u._id !== userId && u.id !== userId);
    saveLocalData(data);
    return true;
  },

  // Seed default demo user and realistic past completed interview for showcase
  async seedDefaultData() {
    try {
      const demoEmail = 'alex.chen@interviewai.demo';
      const existing = await this.findUserByEmail(demoEmail);
      if (existing) return;

      const hashedPassword = await bcrypt.hash('password123', 10);
      const demoUser = await this.createUser({
        name: 'Alex Chen',
        email: demoEmail,
        password: hashedPassword,
        role: 'Full Stack Developer',
        experienceLevel: 'Junior (1-3 yrs)',
        skills: ['JavaScript', 'React', 'Node.js', 'REST APIs', 'System Design', 'Git'],
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });

      const demoUserId = demoUser._id || demoUser.id;

      // Seed 2 realistic completed interview sessions for dashboard showcase
      await this.createSession({
        userId: demoUserId,
        title: 'Full Stack SDE - React & Node Architecture',
        role: 'Full Stack Developer',
        experienceLevel: 'Junior (1-3 yrs)',
        interviewMode: 'technical',
        interactionMode: 'text',
        skills: ['React', 'Node.js', 'REST APIs', 'Performance'],
        status: 'completed',
        currentQuestionIndex: 2,
        totalDurationSeconds: 840,
        startedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        completedAt: new Date(Date.now() - 86400000 * 2 + 840000).toISOString(),
        questions: [
          {
            id: 'q_seed_1',
            questionText: 'Explain how the virtual DOM works in React and how reconciliation optimizes re-renders.',
            category: 'Technical',
            difficulty: 'Medium',
            expectedConcepts: ['Virtual DOM tree diffing', 'Reconciliation algorithm', 'Key prop importance', 'Batching'],
            hints: ['Think about what happens in memory when state changes before touching real DOM nodes.'],
            idealAnswer: 'React maintains an in-memory representation of the UI called the Virtual DOM. When component state changes, React creates a new VDOM tree and diffs it against the previous one using its reconciliation algorithm (Fiber). It computes the minimal set of changes (mutations) and batches them into a single update to the real DOM, avoiding expensive layout reflows.',
            candidateAnswer: 'React maintains a lightweight JavaScript object representation of the real DOM. When state changes, a new virtual tree is generated. React compares the old and new trees using its diffing algorithm (O(n) heuristic), identifying the exact DOM nodes that changed. It then batches these mutations to update the real DOM efficiently, minimizing browser reflows and repaints.',
            timeTakenSeconds: 195,
            evaluation: {
              score: 92,
              relevance: 95,
              technicalDepth: 90,
              clarity: 92,
              starScore: 0,
              codeQuality: 0,
              timeEfficiency: 90,
              strengths: [
                'Clear explanation of the in-memory representation',
                'Accurately highlighted batching and avoidance of browser reflows',
                'Mentioned heuristic diffing complexity'
              ],
              improvements: [
                'Could briefly touch upon React Fiber and how keys prevent unnecessary unmounting in lists.'
              ],
              feedbackText: 'Strong, articulate response demonstrating a solid conceptual grasp of React internal mechanics and performance implications.',
              evaluatedAt: new Date().toISOString()
            }
          },
          {
            id: 'q_seed_2',
            questionText: 'How do you handle unhandled promise rejections and asynchronous error handling in Node.js Express APIs?',
            category: 'Technical',
            difficulty: 'Medium',
            expectedConcepts: ['async/await try-catch', 'Express error handling middleware', 'process.on unhandledRejection', 'Custom AppError'],
            hints: ['Mention both middleware flow and process-level crash safety.'],
            idealAnswer: 'In Express, async route handlers should wrap asynchronous logic with try-catch blocks or use express-async-errors wrapper to forward errors to next(err). A centralized error-handling middleware function (err, req, res, next) formats standard JSON responses and logs errors. Additionally, listen to process.on("unhandledRejection") and "uncaughtException" to cleanly log and terminate or restart workers.',
            candidateAnswer: 'In modern Express applications, I wrap asynchronous routes with try-catch blocks or use an async handler wrapper that forwards any rejected promises to next(err). I configure a centralized error middleware at the bottom of the middleware stack with 4 arguments (err, req, res, next) to send structured error payloads with appropriate HTTP status codes. For safety, I also attach process.on("unhandledRejection") to log unexpected failures.',
            timeTakenSeconds: 220,
            evaluation: {
              score: 88,
              relevance: 90,
              technicalDepth: 86,
              clarity: 89,
              starScore: 0,
              codeQuality: 0,
              timeEfficiency: 88,
              strengths: [
                'Mentioned 4-argument Express error middleware convention',
                'Good emphasis on centralized error handling and structured JSON payloads',
                'Included process-level unhandledRejection listener'
              ],
              improvements: [
                'Could mention process exit/restart strategy with a process manager like PM2 for fatal errors.'
              ],
              feedbackText: 'Great practical answer showing enterprise Node.js experience with proper middleware architecture.',
              evaluatedAt: new Date().toISOString()
            }
          }
        ],
        overallFeedback: {
          overallScore: 90,
          technicalReadiness: 91,
          communicationScore: 89,
          problemSolvingScore: 88,
          strengthsSummary: [
            'Deep conceptual understanding of frontend rendering pipelines',
            'Solid architecture principles for backend error recovery',
            'Clear and structured verbal communication'
          ],
          weaknessesSummary: [
            'Could quantify performance benefits with concrete benchmarks',
            'Slightly over-focused on happy path edge cases'
          ],
          actionableTips: [
            'Practice explaining React 18 concurrent features (useTransition, Suspense)',
            'Review node cluster management and graceful shutdown signals (SIGTERM)'
          ],
          recommendation: 'Strong Hire',
          summaryText: 'Candidate demonstrated great proficiency in full-stack architecture, providing confident, well-reasoned answers.'
        }
      });

      // Seed a behavioral mock interview
      await this.createSession({
        userId: demoUserId,
        title: 'Behavioral & Leadership Mock (STAR Method)',
        role: 'Full Stack Developer',
        experienceLevel: 'Junior (1-3 yrs)',
        interviewMode: 'behavioral',
        interactionMode: 'voice',
        skills: ['Teamwork', 'Conflict Resolution', 'Ownership', 'Communication'],
        status: 'completed',
        currentQuestionIndex: 2,
        totalDurationSeconds: 610,
        startedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        completedAt: new Date(Date.now() - 86400000 * 5 + 610000).toISOString(),
        questions: [
          {
            id: 'q_seed_3',
            questionText: 'Tell me about a time you disagreed with a teammate on a technical decision and how you resolved it.',
            category: 'Behavioral',
            difficulty: 'Medium',
            expectedConcepts: ['STAR Method', 'Situation & Task', 'Collaborative Action', 'Measurable Result', 'Humility'],
            hints: ['Focus on technical merit and empathy rather than proving yourself right.'],
            idealAnswer: 'Situation: During a sprint, our senior engineer wanted Redux while I advocated for React Query. Task: Choose the optimal state management tool without creating friction. Action: I benchmarked both with a quick spike prototype and presented data showing a 40% reduction in boilerplate and built-in caching. Result: The team adopted React Query, accelerating delivery by a week while maintaining mutual respect.',
            candidateAnswer: 'In our last project, a teammate wanted to implement client-side polling for notification updates, whereas I suggested Server-Sent Events (SSE) to reduce server load. I listened to his concern regarding simplicity, then built a quick proof-of-concept showing SSE reduced network requests by 85%. We agreed to test it together, and it worked flawlessly in production without bogging down our database.',
            timeTakenSeconds: 180,
            evaluation: {
              score: 85,
              relevance: 90,
              technicalDepth: 80,
              clarity: 88,
              starScore: 88,
              codeQuality: 0,
              timeEfficiency: 85,
              strengths: [
                'Structured response adhering closely to the STAR method',
                'Demonstrated proof-of-concept spike approach over arguing',
                'Quantified the outcome with an 85% network reduction metric'
              ],
              improvements: [
                'Mention how you ensured the teammate felt valued throughout the outcome.'
              ],
              feedbackText: 'Very well structured behavioral answer showcasing maturity, data-driven compromise, and teamwork.',
              evaluatedAt: new Date().toISOString()
            }
          }
        ],
        overallFeedback: {
          overallScore: 85,
          technicalReadiness: 82,
          communicationScore: 88,
          problemSolvingScore: 85,
          strengthsSummary: [
            'Effective utilization of the STAR framework',
            'Strong empathy and evidence-driven problem resolution'
          ],
          weaknessesSummary: [
            'Could include more details on long-term team relationship building'
          ],
          actionableTips: [
            'Include personal reflection on what you learned from the conflict'
          ],
          recommendation: 'Hire',
          summaryText: 'Alex demonstrated solid interpersonal skills and professional conflict resolution.'
        }
      });

      console.log('\x1b[32m[Database] Default demo account and showcase sessions seeded successfully.\x1b[0m');
    } catch (err) {
      console.error('Error seeding default data:', err.message);
    }
  }
};

export default dbStore;
