// Curated question bank with detailed rubrics, progressive hints, starter code, and test cases
export const QUESTION_BANK = [
  // --- FRONTEND DEVELOPER ---
  {
    id: 'fe_tech_1',
    role: 'Frontend Developer',
    experienceLevels: ['Fresher / Entry Level', 'Junior (1-3 yrs)'],
    mode: 'technical',
    category: 'Technical',
    difficulty: 'Medium',
    questionText: 'Explain the difference between useEffect, useLayoutEffect, and useMemo in React. When would using useLayoutEffect prevent visual flickering?',
    expectedConcepts: ['Component lifecycle', 'DOM paint timing', 'useLayoutEffect runs synchronously after DOM mutations but before browser paints', 'useMemo for memoizing expensive calculations', 'Visual flicker prevention with layout measurements'],
    hints: [
      'Think about the exact point in time when the browser repaints pixels to the screen.',
      'useLayoutEffect is synchronous with DOM mutations, while useEffect is asynchronous and scheduled after the paint.',
      'Consider reading element bounding rects or scroll positions before the user sees the frame.'
    ],
    idealAnswer: 'In React, useEffect runs asynchronously after the component renders and after the browser has completed painting changes to the screen, which avoids blocking UI responsiveness. useLayoutEffect, on the other hand, fires synchronously after React mutates the DOM but before the browser performs layout and paint. It is specifically used when measuring DOM elements (e.g., getBoundingClientRect) or mutating styles before the user sees the frame, preventing visual flicker. useMemo is used to memoize expensive computations between re-renders based on a dependency array.',
  },
  {
    id: 'fe_tech_2',
    role: 'Frontend Developer',
    experienceLevels: ['Fresher / Entry Level', 'Junior (1-3 yrs)', 'Mid-Level (3-5 yrs)'],
    mode: 'technical',
    category: 'Technical',
    difficulty: 'Medium',
    questionText: 'How does CSS specificity work, and how does the browser resolve conflicting styles? Explain how the Cascade Layer (@layer) changes this.',
    expectedConcepts: ['Inline styles (1000)', 'IDs (100)', 'Classes / Attributes / Pseudo-classes (10)', 'Elements / Pseudo-elements (1)', '!important modifier', '@layer cascade layers'],
    hints: [
      'Break specificity down into a 4-part weight system (Inline, ID, Class, Element).',
      'Mention how the !important declaration alters the standard resolution order.',
      '@layer allows developers to control cascade priority regardless of selector specificity.'
    ],
    idealAnswer: 'CSS specificity is a weight system calculated based on the types of selectors used: inline styles (1,0,0,0), ID selectors (0,1,0,0), classes, attributes, and pseudo-classes (0,0,1,0), and element selectors (0,0,0,1). The selector with the highest tuple weight wins. The !important declaration overrides normal specificity. Modern CSS introduced @layer, which defines explicit priority orders between style layers; styles in higher-priority layers override lower-priority layers regardless of the specificity within those layers.',
  },
  {
    id: 'fe_coding_1',
    role: 'Frontend Developer',
    experienceLevels: ['Fresher / Entry Level', 'Junior (1-3 yrs)', 'Mid-Level (3-5 yrs)'],
    mode: 'coding',
    category: 'Coding',
    difficulty: 'Medium',
    questionText: 'Implement a debounce function in JavaScript that delays invoking a given callback until after a specified wait duration has elapsed since the last time it was called. It should support passing the latest arguments and preserving the `this` context.',
    expectedConcepts: ['Closures', 'setTimeout and clearTimeout', 'Preserving `this` context', 'Forwarding arguments', 'Event handlers'],
    hints: [
      'Use a variable in the outer closure to store the timer ID.',
      'Whenever the returned function is called, clear any pending timer.',
      'Schedule a new timer with setTimeout to execute the callback with args.'
    ],
    starterCode: `function debounce(func, wait) {
  // Your code here
}

// Example usage:
// const log = debounce((text) => console.log(text), 300);
// log('hello');`,
    testCases: [
      { input: 'debounce(fn, 100) called 3 times rapidly at 0ms, 20ms, 40ms', expectedOutput: 'Executed exactly once at 140ms with latest arguments', description: 'Debounces rapid invocations' },
      { input: 'debounce(fn, 50) called with args ("test")', expectedOutput: 'fn invoked with ("test")', description: 'Passes correct arguments' }
    ],
    idealAnswer: `function debounce(func, wait) {
  let timerId = null;
  return function(...args) {
    const context = this;
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}`,
  },
  {
    id: 'fe_coding_2',
    role: 'Frontend Developer',
    experienceLevels: ['Fresher / Entry Level', 'Junior (1-3 yrs)'],
    mode: 'coding',
    category: 'Coding',
    difficulty: 'Easy',
    questionText: 'Write a JavaScript function `flattenArray(arr)` that flattens an arbitrarily deeply nested array of integers into a single flat array without using the built-in `Array.prototype.flat()`.',
    expectedConcepts: ['Recursion', 'Array reduction / loop', 'Base cases', 'Type checking Array.isArray'],
    hints: [
      'Iterate through each element of the array.',
      'If an item is an array (Array.isArray), recursively flatten it and concatenate.',
      'If it is not an array, push it directly to the result.'
    ],
    starterCode: `function flattenArray(arr) {
  // Write your recursive or iterative solution here
  return [];
}`,
    testCases: [
      { input: '[1, [2, [3, [4]], 5]]', expectedOutput: '[1, 2, 3, 4, 5]', description: 'Deeply nested array' },
      { input: '[]', expectedOutput: '[]', description: 'Empty array edge case' },
      { input: '[1, 2, 3]', expectedOutput: '[1, 2, 3]', description: 'Already flat array' }
    ],
    idealAnswer: `function flattenArray(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flattenArray(item));
    } else {
      result.push(item);
    }
  }
  return result;
}`,
  },

  // --- BACKEND DEVELOPER ---
  {
    id: 'be_tech_1',
    role: 'Backend Developer',
    experienceLevels: ['Fresher / Entry Level', 'Junior (1-3 yrs)', 'Mid-Level (3-5 yrs)'],
    mode: 'technical',
    category: 'Technical',
    difficulty: 'Medium',
    questionText: 'What is the difference between SQL and NoSQL databases? In what scenarios would you choose MongoDB over PostgreSQL, and vice versa?',
    expectedConcepts: ['Relational vs Non-relational', 'ACID transactions vs BASE', 'Schema rigidity vs flexible document model', 'Horizontal vs vertical scaling', 'Foreign keys and complex joins'],
    hints: [
      'Compare schema flexibility and how relational integrity is maintained.',
      'Consider queries with deep relationships and joins versus hierarchical, nested documents.',
      'Discuss horizontal scaling (sharding) vs vertical scaling.'
    ],
    idealAnswer: 'SQL databases (like PostgreSQL) are relational, use structured schemas with tables, enforce strict ACID transactions, and excel at complex queries with joins and data integrity across related entities. NoSQL databases (like MongoDB) are document-oriented, store JSON-like schemas, and are designed for horizontal scalability and fast read/writes of nested or polymorphic data. I would choose PostgreSQL for financial transactions, multi-table relationship integrity, and complex analytics. I would choose MongoDB for rapidly evolving schemas, content management, real-time logging, and catalogs with variable attributes.',
  },
  {
    id: 'be_tech_2',
    role: 'Backend Developer',
    experienceLevels: ['Junior (1-3 yrs)', 'Mid-Level (3-5 yrs)', 'Senior (5+ yrs)'],
    mode: 'technical',
    category: 'Architecture',
    difficulty: 'Hard',
    questionText: 'How would you design a rate limiter for a public REST API? Compare Token Bucket and Sliding Window Log algorithms, and explain how Redis can be used in a distributed environment.',
    expectedConcepts: ['Rate limiting algorithms', 'Token Bucket vs Sliding Window', 'Distributed state with Redis', 'Race conditions & atomic Lua scripts', 'HTTP 429 Too Many Requests with Retry-After header'],
    hints: [
      'Think about burst traffic handling vs uniform pacing.',
      'How do you avoid race conditions when multiple API server nodes handle requests concurrently?',
      'Redis INCR or sorted sets with Lua scripts ensure atomic checks.'
    ],
    idealAnswer: 'A rate limiter protects APIs from abuse and denial of service. The Token Bucket algorithm allows token accumulation up to a maximum capacity, accommodating bursts while enforcing a steady refill rate. The Sliding Window Counter or Log algorithm tracks timestamps in a rolling window, eliminating edge-case burst spikes at boundary resets. In a distributed multi-server setup, state must be centralized in Redis. We use Redis sorted sets or key increments evaluated via atomic Lua scripts to prevent race conditions across parallel requests. When limits are exceeded, return HTTP 429 with Retry-After and X-RateLimit headers.',
  },
  {
    id: 'be_coding_1',
    role: 'Backend Developer',
    experienceLevels: ['Fresher / Entry Level', 'Junior (1-3 yrs)', 'Mid-Level (3-5 yrs)'],
    mode: 'coding',
    category: 'Coding',
    difficulty: 'Medium',
    questionText: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Assume each input has exactly one solution, and you may not use the same element twice. Achieve O(n) time complexity.',
    expectedConcepts: ['Hash map / Map lookup', 'One-pass algorithm', 'O(n) time complexity', 'O(n) space complexity', 'Index mapping'],
    hints: [
      'As you iterate through the array, calculate the complement: `target - nums[i]`.',
      'Check if that complement already exists in your hash map.',
      'If not, store the current number and its index in the map.'
    ],
    starterCode: `function twoSum(nums, target) {
  // Return [index1, index2]
  return [];
}`,
    testCases: [
      { input: 'nums = [2, 7, 11, 15], target = 9', expectedOutput: '[0, 1]', description: 'Basic pair' },
      { input: 'nums = [3, 2, 4], target = 6', expectedOutput: '[1, 2]', description: 'Non-consecutive indices' },
      { input: 'nums = [3, 3], target = 6', expectedOutput: '[0, 1]', description: 'Duplicate numbers' }
    ],
    idealAnswer: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
  },

  // --- FULL STACK DEVELOPER ---
  {
    id: 'fs_tech_1',
    role: 'Full Stack Developer',
    experienceLevels: ['Fresher / Entry Level', 'Junior (1-3 yrs)', 'Mid-Level (3-5 yrs)'],
    mode: 'technical',
    category: 'Technical',
    difficulty: 'Medium',
    questionText: 'Explain how JWT (JSON Web Token) authentication works end-to-end. Compare storing tokens in localStorage vs httpOnly Secure Cookies in terms of security (XSS vs CSRF).',
    expectedConcepts: ['JWT header, payload, and signature', 'Stateless authentication', 'localStorage vulnerability to XSS', 'httpOnly cookies protection against XSS', 'CSRF vulnerability and SameSite attribute / CSRF tokens', 'Token expiration & refresh token rotation'],
    hints: [
      'Break down the structure of a JWT (Header.Payload.Signature).',
      'If an attacker executes malicious JavaScript (XSS), what storage mechanism can they access?',
      'How does SameSite cookie attribute mitigate CSRF attacks?'
    ],
    idealAnswer: 'JWTs consist of three parts: Header, Payload, and Signature, signed with a secret or private key. Upon login, the server signs and returns the token; the client attaches it to subsequent requests. Storing JWTs in localStorage is susceptible to Cross-Site Scripting (XSS), as any injected JS script can read localStorage and exfiltrate tokens. Storing tokens in httpOnly Secure cookies prevents JS access, effectively neutralizing XSS token theft. However, cookies are vulnerable to CSRF, which is mitigated using the SameSite=Strict/Lax cookie attribute and anti-CSRF tokens. Best practice is short-lived access tokens in memory/httpOnly cookies combined with refresh token rotation.',
  },
  {
    id: 'fs_coding_1',
    role: 'Full Stack Developer',
    experienceLevels: ['Fresher / Entry Level', 'Junior (1-3 yrs)', 'Mid-Level (3-5 yrs)'],
    mode: 'coding',
    category: 'Coding',
    difficulty: 'Easy',
    questionText: 'Given a string containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. An input string is valid if brackets close in the correct order with matching pairs.',
    expectedConcepts: ['Stack data structure', 'LIFO order', 'Map matching closing to opening bracket', 'String edge cases'],
    hints: [
      'Use a stack to push opening brackets.',
      'When you encounter a closing bracket, check if it matches the top of the stack.',
      'At the end of iteration, verify if the stack is completely empty.'
    ],
    starterCode: `function isValidBrackets(s) {
  // Return true if valid, false otherwise
  return false;
}`,
    testCases: [
      { input: 's = "()[]{}"', expectedOutput: 'true', description: 'Simple matched brackets' },
      { input: 's = "(]"', expectedOutput: 'false', description: 'Mismatched brackets' },
      { input: 's = "([)]"', expectedOutput: 'false', description: 'Interleaved invalid order' },
      { input: 's = "{[]}"', expectedOutput: 'true', description: 'Properly nested brackets' }
    ],
    idealAnswer: `function isValidBrackets(s) {
  const stack = [];
  const map = {
    ')': '(',
    '}': '{',
    ']': '['
  };
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (map[char]) {
      if (stack.pop() !== map[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
  },

  // --- HR / BEHAVIORAL QUESTIONS (All Roles) ---
  {
    id: 'hr_beh_1',
    role: 'All Roles',
    experienceLevels: ['Fresher / Entry Level', 'Junior (1-3 yrs)', 'Mid-Level (3-5 yrs)', 'Senior (5+ yrs)'],
    mode: 'behavioral',
    category: 'Behavioral',
    difficulty: 'Medium',
    questionText: 'Tell me about a challenging technical or project problem you faced, how you approached solving it, and what the ultimate result was.',
    expectedConcepts: ['STAR Method', 'Situation & Context', 'Clear Task / Goal', 'Actionable Steps taken', 'Measurable Result / Impact', 'Personal learnings'],
    hints: [
      'Structure your response: Situation, Task, Action, Result.',
      'Be specific about YOUR contribution, using "I" instead of only "we".',
      'Quantify the result with metrics (e.g., improved latency by 30%, delivered 2 days ahead of schedule).'
    ],
    idealAnswer: 'Situation: At my previous company/university project, our user dashboard experienced 4-second page load times due to unindexed database queries and oversized bundle sizes. Task: My objective was to reduce page load time under 1 second before our product launch. Action: I profiled network traffic, implemented code splitting with React lazy loading, and added database indexing on frequently filtered columns. Result: Load times dropped by 78% to 850ms, improving user retention by 22% during our launch sprint.',
  },
  {
    id: 'hr_beh_2',
    role: 'All Roles',
    experienceLevels: ['Fresher / Entry Level', 'Junior (1-3 yrs)', 'Mid-Level (3-5 yrs)', 'Senior (5+ yrs)'],
    mode: 'behavioral',
    category: 'Behavioral',
    difficulty: 'Medium',
    questionText: 'Describe a situation where you had to learn a completely new technology or framework under tight deadlines. How did you manage your time and ensure successful delivery?',
    expectedConcepts: ['Growth mindset', 'Prioritization', 'Documentation & community resources', 'Incremental prototyping', 'Delivering under pressure'],
    hints: [
      'Highlight how you broke down the learning curve into manageable modules.',
      'Discuss how you built a small proof of concept before tackling full production code.',
      'Show enthusiasm for continuous learning and adaptability.'
    ],
    idealAnswer: 'Situation: Our team needed to integrate a GraphQL service with Apollo Client for a mobile web feature, a technology I had not used before, with a 2-week deadline. Task: I was responsible for delivering the data-fetching layer while ensuring zero regressions. Action: I dedicated the first two days to official documentation and tutorials, built a sandbox prototype to validate query caching, and paired with a senior dev for a quick architecture review. Result: The integration launched two days ahead of schedule, with reusable custom hooks that the team adopted across two other features.',
  },
  {
    id: 'hr_beh_3',
    role: 'All Roles',
    experienceLevels: ['Fresher / Entry Level', 'Junior (1-3 yrs)', 'Mid-Level (3-5 yrs)'],
    mode: 'behavioral',
    category: 'Behavioral',
    difficulty: 'Easy',
    questionText: 'Why are you interested in this role and our company, and what unique value do you bring as a candidate?',
    expectedConcepts: ['Company alignment', 'Self-awareness of strengths', 'Career trajectory', 'Passionate work ethic', 'Relevant skills match'],
    hints: [
      'Connect your genuine technical interests with the company mission.',
      'State 2-3 concrete skills or traits you possess (e.g. attention to detail, quick learner).',
      'Show excitement about growing with the team.'
    ],
    idealAnswer: 'I am drawn to this role because it aligns directly with my passion for building high-performance, user-centric software that scales. Over my recent projects, I have developed strong fundamentals in full-stack JavaScript, writing clean, testable code, and collaborating constructively in Agile environments. What sets me apart is my relentless curiosity, fast learning curve, and dedication to user experience. I am excited to contribute immediately to your product roadmap while continuing to grow with your engineering team.',
  },

  // --- CAMPUS / FRESHER SPECIAL ---
  {
    id: 'fr_tech_1',
    role: 'Campus Fresher / General SDE',
    experienceLevels: ['Fresher / Entry Level'],
    mode: 'technical',
    category: 'Technical',
    difficulty: 'Easy',
    questionText: 'Explain the four core principles of Object-Oriented Programming (OOP) with real-world analogies: Encapsulation, Abstraction, Inheritance, and Polymorphism.',
    expectedConcepts: ['Encapsulation (data hiding & bundling)', 'Abstraction (hiding implementation details)', 'Inheritance (code reuse via parent/child)', 'Polymorphism (many forms / method overriding and overloading)'],
    hints: [
      'Encapsulation: Like a medical capsule or bank account holding balance private.',
      'Abstraction: Like driving a car—pressing the gas pedal without needing to know engine piston mechanics.',
      'Inheritance & Polymorphism: Animal hierarchy and makeSound() behaving differently for Dog and Cat.'
    ],
    idealAnswer: 'The four OOP principles are: 1. Encapsulation: Bundling data and methods into a single unit (class) and restricting direct access to internal state using private variables and getters/setters (e.g. a bank account protecting balance). 2. Abstraction: Hiding internal complexity and exposing only necessary interfaces (e.g. driving a car by using pedals without knowing fuel-injection mechanics). 3. Inheritance: Enabling a child class to inherit properties and methods from a parent class for code reuse (e.g. ElectricCar inheriting from Vehicle). 4. Polymorphism: Allowing entities to take multiple forms through method overriding or overloading (e.g. a draw() method rendering differently for Circle and Rectangle).',
  },
  {
    id: 'fr_coding_1',
    role: 'Campus Fresher / General SDE',
    experienceLevels: ['Fresher / Entry Level'],
    mode: 'coding',
    category: 'Coding',
    difficulty: 'Easy',
    questionText: 'Write a function `isPalindrome(s)` that determines if a given string is a palindrome, considering only alphanumeric characters and ignoring cases. For example, "A man, a plan, a canal: Panama" is true.',
    expectedConcepts: ['Two-pointer technique', 'String manipulation', 'Regex or char code validation', 'O(n) time, O(1) space'],
    hints: [
      'Convert characters to lowercase.',
      'Use two pointers, one at the start (left) and one at the end (right).',
      'Skip non-alphanumeric characters, and compare characters until pointers meet.'
    ],
    starterCode: `function isPalindrome(s) {
  // Your code here
  return false;
}`,
    testCases: [
      { input: 's = "A man, a plan, a canal: Panama"', expectedOutput: 'true', description: 'Standard alphanumeric palindrome' },
      { input: 's = "race a car"', expectedOutput: 'false', description: 'Not a palindrome' },
      { input: 's = " "', expectedOutput: 'true', description: 'Empty or space-only string' }
    ],
    idealAnswer: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
  },

  // --- DEVOPS & CLOUD ENGINEER ---
  {
    id: 'devops_tech_1',
    role: 'DevOps / Cloud Engineer',
    experienceLevels: ['Fresher / Entry Level', 'Junior (1-3 yrs)', 'Mid-Level (3-5 yrs)'],
    mode: 'technical',
    category: 'Technical',
    difficulty: 'Medium',
    questionText: 'What is the difference between Containerization (Docker) and Virtual Machines (VMs)? How does Docker leverage the Linux kernel features (namespaces and cgroups)?',
    expectedConcepts: ['Docker vs Hypervisor', 'Shared Host Kernel vs Guest OS', 'Namespaces for isolation', 'Control Groups (cgroups) for resource limits', 'Startup time & overhead'],
    hints: [
      'VMs virtualize hardware and run an entire guest operating system.',
      'Containers share the host OS kernel and package only the application and runtime dependencies.',
      'Namespaces isolate processes, networks, and filesystems; cgroups govern CPU and memory limits.'
    ],
    idealAnswer: 'Virtual Machines virtualize the underlying hardware via a hypervisor (e.g. VMware, KVM), requiring a complete guest operating system for each VM, which introduces significant memory overhead and multi-minute boot times. Docker containers share the host Linux kernel, isolating user-space processes. Docker achieves isolation using Linux namespaces (PID, NET, MNT, IPC, UTS) to provide private views of processes, network interfaces, and file systems, and cgroups (control groups) to enforce resource boundaries on CPU, memory, and I/O. This results in lightweight containers that start in milliseconds and maximize host utilization.',
  },

  // --- DATA SCIENTIST / AI ENGINEER ---
  {
    id: 'ds_tech_1',
    role: 'Data Scientist / AI Engineer',
    experienceLevels: ['Fresher / Entry Level', 'Junior (1-3 yrs)', 'Mid-Level (3-5 yrs)'],
    mode: 'technical',
    category: 'Technical',
    difficulty: 'Medium',
    questionText: 'Explain the bias-variance tradeoff in Machine Learning. How do techniques like Cross-Validation, Regularization (L1/L2), and Ensemble methods mitigate overfitting?',
    expectedConcepts: ['High bias = Underfitting', 'High variance = Overfitting', 'Tradeoff curve', 'L1 (Lasso) vs L2 (Ridge) penalties', 'K-fold Cross-validation', 'Bagging vs Boosting'],
    hints: [
      'Bias represents assumptions made by the model; variance represents sensitivity to fluctuations in training data.',
      'L1 introduces sparsity (feature selection), L2 penalizes large weights.',
      'Cross-validation ensures evaluation on unseen subsets.'
    ],
    idealAnswer: 'The bias-variance tradeoff is the central challenge in supervised machine learning: high bias leads to underfitting (the model is too simplistic to capture underlying patterns), while high variance causes overfitting (the model memorizes noise in training data and fails to generalize to unseen test data). K-fold cross-validation evaluates model performance across multiple splits to detect overfitting early. L1 regularization (Lasso) adds an absolute weight penalty promoting parameter sparsity, while L2 regularization (Ridge) penalizes squared weights to constrain large coefficients. Ensemble methods like Random Forests (Bagging) reduce variance by averaging diverse trees, whereas Gradient Boosting sequentially corrects residual errors.',
  }
];

// Helper to get questions filtered by role, level, mode, and count
export const getFilteredQuestions = ({ role, experienceLevel, mode, skills = [], count = 3 }) => {
  let pool = QUESTION_BANK.filter((q) => {
    // Mode match
    if (mode && mode !== 'mixed') {
      if (q.mode !== mode) return false;
    }
    // Role match: match exact role or 'All Roles'
    if (role) {
      const roleMatch = q.role === role || q.role === 'All Roles' || role.includes(q.role) || q.role.includes(role);
      if (!roleMatch && q.role !== 'All Roles') return false;
    }
    return true;
  });

  // If pool is too small, fallback to all questions of that mode or generic
  if (pool.length < count) {
    const extra = QUESTION_BANK.filter((q) => !pool.some((item) => item.id === q.id));
    pool = [...pool, ...extra];
  }

  // Shuffle pool
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
