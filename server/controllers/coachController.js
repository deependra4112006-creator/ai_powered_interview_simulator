import { getAIEngineStatus } from '../services/aiService.js';

/**
 * Controller for AI Interview Coach Chat
 * Supports querying live LLMs (Gemini / OpenAI) with high-fidelity fallback.
 */
export const chatWithCoach = async (req, res) => {
  try {
    const { message = '', history = [] } = req.body;
    const user = req.user || {};
    const engineStatus = getAIEngineStatus();

    if (!message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    // If live Gemini LLM is active, attempt to generate real AI response
    if (engineStatus.isLiveLLM && process.env.GEMINI_API_KEY) {
      try {
        const geminiReply = await callGeminiCoachChat({ message, history, user });
        if (geminiReply) {
          return res.json({
            success: true,
            reply: geminiReply.text,
            suggestedPrompts: geminiReply.suggestedPrompts || getDefaultSuggestedPrompts(message),
            engine: engineStatus.provider
          });
        }
      } catch (err) {
        console.warn('[Coach API] Gemini call failed, using high-fidelity coach engine:', err.message);
      }
    }

    // High-fidelity domain-specialized AI coaching engine
    const responseData = generateDomainCoachResponse(message, history, user);

    return res.json({
      success: true,
      reply: responseData.reply,
      suggestedPrompts: responseData.suggestedPrompts,
      action: responseData.action || null,
      engine: 'InterviewAI Coach Engine (Simulation)'
    });
  } catch (err) {
    console.error('Error in chatWithCoach:', err);
    return res.status(500).json({ success: false, message: 'Server error processing coaching query.' });
  }
};

/**
 * Live Google Gemini API Caller for Coach
 */
async function callGeminiCoachChat({ message, history = [], user = {} }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const systemInstruction = `You are an elite Silicon Valley Tech Interview Coach and Principal Engineering Mentor at InterviewAI.
Your goal is to guide candidates across Software Engineering, Frontend, Backend, System Design, DSA, and Behavioral (STAR) interviews.
Be encouraging, analytical, structured, and concise. Format responses with clear headings, markdown bullets, and actionable tips.
Candidate Target Role: ${user.role || 'Software Engineer'}, Experience: ${user.experienceLevel || 'Mid-Level'}.`;

  const contents = [];
  // Append past turns (up to 4)
  history.slice(-4).forEach((turn) => {
    contents.push({
      role: turn.sender === 'user' ? 'user' : 'model',
      parts: [{ text: turn.text }]
    });
  });

  contents.push({
    role: 'user',
    parts: [{ text: `${systemInstruction}\n\nCandidate Question: ${message}` }]
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No candidate response from Gemini');

  return {
    text,
    suggestedPrompts: getDefaultSuggestedPrompts(message)
  };
}

/**
 * Domain-Specialized Heuristic Coach Engine
 * Hand-tailored for the 5 prompt types and general engineering inquiries
 */
function generateDomainCoachResponse(msg, history, user) {
  const lower = msg.toLowerCase().trim();

  // 1. "Give me a mock interview."
  if (lower.includes('mock interview') || lower.includes('start interview') || lower.includes('give me a mock')) {
    return {
      reply: `### Ready for a Full Mock Interview Simulation? 🎯

I'm ready to run a realistic simulation tailored to your profile as a **${user.role || 'Software Engineer'}** (${user.experienceLevel || 'Mid-Level'}).

Here is how we can structure it:
1. **Full Adaptive Interview**: A dedicated timed session featuring live voice or text evaluation, progressive hints, and an end-of-round performance scorecard.
2. **Mini Rapid-Fire Round (Right Here in Chat)**:
   - **Question 1**: *"Tell me about yourself and an architectural challenge you solved recently."*
   - Take 60–90 seconds to reply, and I will evaluate your pacing and technical depth immediately.

Would you like to launch the full simulator now, or answer Question 1 here in our chat?`,
      suggestedPrompts: [
        'Start full simulator interview',
        'Ask me Question 1 here',
        'Change difficulty to Hard'
      ],
      action: {
        type: 'start_interview',
        label: 'Launch Full Interview Simulator',
        config: {
          role: user.role || 'Software Engineer',
          interviewType: 'technical',
          difficulty: 'medium'
        }
      }
    };
  }

  // 2. "Ask me JavaScript questions."
  if (lower.includes('javascript') || lower.includes('js question')) {
    return {
      reply: `### JavaScript Technical Deep-Dive ⚡

Here are 3 high-frequency questions asked in top tech engineering screens:

1. **Event Loop Mechanics**:
   - *"Explain the exact sequence of execution between the Call Stack, Microtasks (Promises, queueMicrotask), and Macrotasks (setTimeout, I/O). In what scenario can microtasks starve the browser UI from repainting?"*

2. **Closures & Scope Leakage**:
   - *"How do lexical closures work under the hood? Explain how closures can accidentally retain references in memory leading to detached DOM leaks."*

3. **Debounce vs. Throttle**:
   - *"When would you implement a debounce versus a throttle? Write out the logic of preserving \`this\` and argument forwarding."*

**Your turn!** Choose one of the above to answer first, and I will critique your depth and precision as an interviewer.`,
      suggestedPrompts: [
        'Answer Question 1 (Event Loop)',
        'Explain Debounce vs Throttle',
        'Ask me React questions instead'
      ]
    };
  }

  // 3. "Help me improve my introduction."
  if (lower.includes('introduction') || lower.includes('tell me about yourself') || lower.includes('improve my intro') || lower.includes('elevator pitch')) {
    return {
      reply: `### Crafting an Exceptional 90-Second Introduction 🚀

Interviewers ask *"Tell me about yourself"* not for your life story, but to evaluate **communication conciseness, technical maturity, and narrative relevance**.

Use the **Present → Past → Future (90-Second Formula)**:

#### 1. Present (30 Seconds)
- **Who you are & core stack**: *"I’m a Software Engineer specializing in scalable full-stack applications with React, TypeScript, and distributed Node.js backends."*
- **Current impact**: *"In my current role, I focus on microservice architectures and high-throughput API design."*

#### 2. Past (45 Seconds)
- **Quantifiable achievement**: *"Previously, I spearheaded a migration from a monolithic backend to containerized services, which cut deployment cycle times by 35% and improved P99 API latency from 450ms to 95ms."*
- **Leadership / collaboration**: *"I also enjoy establishing testing benchmarks and mentoring teammates through architectural RFCs."*

#### 3. Future (15 Seconds)
- **Why this role right now**: *"I’m excited about this opportunity because of your team’s focus on high-concurrency cloud tooling, which aligns directly with my engineering passions."*

**Action Item:** Type your draft introduction below, and I will critique it with actionable line-by-line feedback!`,
      suggestedPrompts: [
        'Review my draft intro',
        'How long should my intro be?',
        'What are common intro mistakes?'
      ]
    };
  }

  // 4. "Explain my interview mistakes."
  if (lower.includes('mistake') || lower.includes('feedback') || lower.includes('weakness') || lower.includes('improve')) {
    return {
      reply: `### Top 5 Interview Pitfalls & How to Avoid Them 🔍

Based on evaluations across thousands of candidate sessions, here are the most critical mistakes that cost candidates job offers:

1. **Jumping Straight into Code Without Clarifying Constraints**:
   - *Mistake*: Immediately typing code without asking about input bounds, nulls, duplicates, or expected time/space constraints.
   - *Fix*: Spend 2–3 minutes clarifying constraints and validating assumptions with examples first.

2. **Omitting Big-O Invariants Under Pressure**:
   - *Mistake*: Writing an algorithm without articulating its time and space complexity upfront.
   - *Fix*: State: *"Before I implement this, my approach uses a Hash Map for O(N) time and O(N) auxiliary space."*

3. **Using "We" Instead of "I" in Behavioral (STAR) Questions**:
   - *Mistake*: Describing what the team did without clarifying YOUR specific contribution.
   - *Fix*: Explicitly state: *"My team owned the migration, and my personal responsibility was authoring the database schema and caching layer."*

4. **Rambling Past 2 Minutes Without a Check-in**:
   - *Mistake*: Monologuing for 5+ minutes while the interviewer loses engagement.
   - *Fix*: Pause at the 90-second mark: *"I can elaborate further on the sharding mechanics or discuss our failover testing—which would you like to explore?"*

Which of these areas would you like to drill down into today?`,
      suggestedPrompts: [
        'How to manage time in coding rounds',
        'Review the STAR method rules',
        'Analyze my recent interview scores'
      ]
    };
  }

  // 5. "Give me DSA interview questions."
  if (lower.includes('dsa') || lower.includes('data structure') || lower.includes('algorithm')) {
    return {
      reply: `### Curated DSA Algorithmic Challenges 🧩

Here are 3 standard problems frequently tested by top tech companies:

#### 1. Two Sum (Hash Map Lookup) — Easy / Medium
- **Problem**: Given an array of integers \`nums\` and integer \`target\`, return indices of two numbers adding up to \`target\` in **O(N) time**.
- **Key Insight**: Maintain a running complement table to trade linear space for O(1) lookups.

#### 2. LRU Cache (Least Recently Used) — Hard
- **Problem**: Design an in-memory key-value cache with $O(1)$ \`get()\` and \`put()\` operations under a fixed capacity.
- **Key Insight**: Combine a Hash Map with a Doubly Linked List with dummy head and tail sentinel nodes.

#### 3. Coin Change (Dynamic Programming) — Medium
- **Problem**: Return the fewest number of coins needed to make up amount $A$ using denominations $[c_1, c_2, \\dots]$.
- **Key Insight**: Bottom-up tabulation where $dp[i] = \\min(dp[i], dp[i - \\text{coin}] + 1)$.

Would you like to solve one of these in our dedicated Coding Interview sandbox?`,
      suggestedPrompts: [
        'Solve Two Sum in Code Sandbox',
        'Explain LRU Cache Doubly Linked List',
        'Give me Tree & Graph questions'
      ],
      action: {
        type: 'open_coding',
        label: 'Open Coding Sandbox'
      }
    };
  }

  // General fallback engineering coaching
  return {
    reply: `### Engineering Coach Analysis 💡

That's a great question regarding **${msg.slice(0, 40)}...**

Here is my recommended strategic approach:

1. **Clarify the Core Objective**: In tech interviews, interviewers prioritize clarity of communication, structured thinking, and systematic reasoning before premature optimization.
2. **Deconstruct Trade-Offs**: Whenever choosing an architecture or algorithm, always contrast your choice against an alternative (e.g., *SQL vs. NoSQL*, *Recursion vs. Iteration*, *Throughput vs. Latency*).
3. **Validate Edge Cases**: Actively identify boundary limits—empty collections, concurrency race conditions, and network partition timeouts.

What specific aspect or follow-up question would you like to dive into next?`,
    suggestedPrompts: [
      'Give me a mock interview.',
      'Ask me JavaScript questions.',
      'Help me improve my introduction.',
      'Give me DSA interview questions.'
    ]
  };
}

function getDefaultSuggestedPrompts(msg) {
  return [
    'Give me a mock interview.',
    'Ask me JavaScript questions.',
    'Help me improve my introduction.',
    'Explain my interview mistakes.',
    'Give me DSA interview questions.'
  ];
}
