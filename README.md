# InterviewAI — AI-Powered Realistic Interview Simulator

**InterviewAI** is a modern full-stack web application designed for college students, freshers, job seekers, and software engineers to practice realistic technical, coding, and behavioral interviews with real-time AI feedback and performance analytics.

---

## 🌟 Key Highlights & Features

1. **User Authentication & Instant Demo**
   - JWT-based authentication with bcrypt password encryption.
   - **⚡ 1-Click Instant Demo Login**: Test immediately as Alex Chen (Junior Full Stack Developer) with pre-seeded history and analytics without typing credentials.

2. **Interactive AI Interviewer (Dr. Elena Vance)**
   - Live avatar with animated states: *Speaking*, *Listening*, *Evaluating*, and *Idle*.
   - **Voice-Based Interview Mode**: Uses the browser's Web Speech API for natural text-to-speech reading of questions and real-time continuous speech-to-text transcription of candidate answers with live frequency audio waveform.
   - **Text-Based Interview Mode**: Distraction-free, formatted response editor with live word count.

3. **Interview Formats & Custom Roles**
   - **Technical Interviews**: Deep conceptual questions, architecture, runtime internals, and trade-offs.
   - **HR / Behavioral Interviews**: Evaluated using the **STAR Framework** (*Situation, Task, Action, Result*) with an integrated collapsible STAR cheatsheet.
   - **Live Coding Challenge Mode**: Interactive code editor with line numbers, multi-language support (JavaScript, Python, Java, C++), and a live test runner executing test cases with input/output validation.
   - **Target Roles**: Frontend Developer, Backend Developer, Full Stack Developer, Campus Fresher / General SDE, DevOps & Cloud, Data Science & AI.
   - **Experience Levels**: Fresher / Intern (0-1 yrs), Junior (1-3 yrs), Mid-Level (3-5 yrs), Senior (5+ yrs).

4. **Real-Time AI Evaluation & Rubrics**
   - 0–100 composite score based on:
     - Technical Accuracy & Depth
     - Verbal / Written Clarity
     - Problem Solving & Structure (STAR for behavioral)
     - Code Quality & Big-O Time/Space complexity
   - Highlighted **Key Strengths** and prioritized **Areas for Growth**.
   - Curated **Top-Scoring Model Answers** for every question to help candidates learn ideal answers.
   - Collaborative **Progressive Hints System** that guides candidates without penalizing scores.

5. **Performance Analytics & Skill Radar**
   - Visual readiness charts tracking performance progression over time.
   - Competency breakdown across System Architecture, Algorithms, Frameworks, Behavioral, and Verbal Clarity.
   - Historical interview archive with search, format filters, review reports, and PDF print/export.

6. **Dual Database Architecture (MongoDB + Zero-Config Persistent Fallback)**
   - Connects to MongoDB when `MONGODB_URI` is provided or MongoDB is running locally.
   - Automatically activates a local JSON datastore adapter (`server/data/db.json`) if MongoDB is not reachable, guaranteeing 100% out-of-the-box functionality with zero setup.

7. **AI Integration Architecture (LLM Provider Pattern)**
   - Modular `aiService.js` abstraction.
   - **Live LLM Ready**: Simply set `GEMINI_API_KEY` or `OPENAI_API_KEY` in `server/.env` to switch to live Gemini/GPT models.
   - **Domain Simulation Engine**: High-fidelity heuristic NLP and rubric scoring engine when no API keys are provided.
   - Includes a dynamic API key verification tool in the Settings page.

8. **Design & Aesthetics**
   - Premium SaaS dark and light modes.
   - Professional indigo/violet and cyan accents.
   - Inter and JetBrains Mono typography.
   - Smooth animations, confetti celebrations, and fully responsive across mobile, tablet, and desktop.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, REST APIs, JSON Web Tokens (JWT), Bcrypt.js.
- **Database**: MongoDB (Mongoose) with automatic persistent local JSON fallback.
- **APIs & Web Standards**: Web Speech API (SpeechRecognition & SpeechSynthesis).

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- Node.js (v18+ recommended)
- npm

### 1. Installation
In the project root, install all dependencies:
```bash
npm run install:all
```
*(Or install in both folders: `cd server && npm install`, then `cd ../client && npm install`)*

### 2. Run Both Frontend and Backend Concurrently
From the root directory:
```bash
npm run dev
```
Or run the runner directly:
```bash
node run-dev.js
```

### 3. Open in Browser
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🔑 Environment Variables

The server configuration template is located in `server/.env.example`:
```env
PORT=5000
NODE_ENV=development

# MongoDB connection string (local or MongoDB Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/interviewai

# JWT secret key
JWT_SECRET=interviewai_super_secret_jwt_key_2026_dev_secure

# Optional: Add your Gemini or OpenAI API Key for live LLM generation
GEMINI_API_KEY=
OPENAI_API_KEY=

# Client CORS URL
CLIENT_URL=http://localhost:5173
```

---

## 📂 Project Architecture

```
Interview Sim/
├── package.json                 # Root script orchestrator
├── run-dev.js                   # Concurrent dev launcher
├── README.md                    # Project documentation
├── server/
│   ├── server.js                # Express app initialization & route mounting
│   ├── .env                     # Environment variables
│   ├── .env.example             # Template for environment variables
│   ├── config/
│   │   └── db.js                # Mongoose connection with automatic fallback detection
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── InterviewSession.js  # Interview session & rubric schema
│   ├── middleware/
│   │   └── auth.js              # JWT Bearer authentication middleware
│   ├── controllers/
│   │   ├── authController.js    # Register, login, 1-click guest login, profile
│   │   ├── interviewController.js # Session lifecycle, Q&A evaluation, hints, code runner
│   │   ├── analyticsController.js # Readiness scores, radar breakdown, progression
│   │   └── settingsController.js  # AI engine status & dynamic LLM API tester
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── interviewRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── settingsRoutes.js
│   ├── services/
│   │   ├── aiService.js         # Unified AI service (LLM adapter + Simulation engine)
│   │   ├── questionBank.js      # Curated questions, starter code, test cases, model answers
│   │   └── dbStore.js           # Seamless Mongo / JSON persistent datastore adapter
│   └── data/
│       └── db.json              # Local persistent database
└── client/
    ├── index.html               # Semantic HTML5 entry with Inter font & favicon
    ├── vite.config.js           # Vite config with Tailwind & /api proxy to localhost:5000
    ├── src/
    │   ├── App.jsx              # Main router & state coordinator
    │   ├── main.jsx             # React entry point
    │   ├── index.css            # Tailwind CSS tokens, animations & scrollbars
    │   ├── context/
    │   │   ├── AuthContext.jsx  # Authentication state & persistent token
    │   │   └── ThemeContext.jsx # Dark / Light mode toggle & persistence
    │   ├── hooks/
    │   │   ├── useSpeechRecognition.js # Web Speech API voice capture
    │   │   └── useSpeechSynthesis.js   # Text-to-speech voice reader
    │   ├── services/
    │   │   └── api.js           # REST API client
    │   ├── components/
    │   │   ├── common/          # Navbar, Footer, etc.
    │   │   ├── interview/       # InterviewerAvatar, VoiceController, CodeEditor, Timer, HintModal, StarGuide
    │   │   ├── feedback/        # ScoreCard, FeedbackDetail
    │   │   └── dashboard/       # StatCard, TrackRecommendations, RecentInterviews
    │   └── pages/
    │       ├── LandingPage.jsx
    │       ├── LoginPage.jsx
    │       ├── RegisterPage.jsx
    │       ├── DashboardPage.jsx
    │       ├── InterviewSetupPage.jsx
    │       ├── ActiveInterviewPage.jsx
    │       ├── InterviewSummaryPage.jsx
    │       ├── HistoryPage.jsx
    │       ├── AnalyticsPage.jsx
    │       └── SettingsProfilePage.jsx
```

---

## 🧪 Testing the Application

1. Open [http://localhost:5173](http://localhost:5173).
2. Click **⚡ 1-Click Instant Demo** to sign in as *Alex Chen*.
3. Explore the **Dashboard**: view key metrics, recent interviews, and pre-built tracks.
4. Click **Start Custom Mock** to open the configurator. Choose your role, format (Technical, Behavioral, or Coding), and interaction mode (Voice or Text).
5. In the **Active Session**:
   - Hear the question spoken aloud or replay it with the voice controls.
   - Request progressive hints if needed.
   - For coding questions, write code and click **Run Test Cases** to validate outputs.
   - For behavioral questions, refer to the **STAR Method Guide**.
   - Submit your answer to see the AI rubric evaluation.
6. Review the **Summary Report**: inspect the composite score, strengths, growth areas, and ideal model answers.
7. Visit **Analytics** for competency radar charts and **History** to filter past interviews.
