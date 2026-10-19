/**
 * Curated practice questions catalog across all 9 core interview tracks:
 * - DSA
 * - JavaScript
 * - React
 * - Python
 * - Java
 * - SQL
 * - System Design
 * - HR
 * - Behavioral
 */

export const PRACTICE_CATEGORIES = [
  'DSA',
  'JavaScript',
  'React',
  'Python',
  'Java',
  'SQL',
  'System Design',
  'HR',
  'Behavioral'
];

export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

export const INTERVIEW_TYPES = [
  'Coding',
  'Technical',
  'System Design',
  'Behavioral',
  'HR'
];

export const PRACTICE_QUESTIONS = [
  // =========================================================================
  // 1. DSA (Data Structures & Algorithms)
  // =========================================================================
  {
    id: 'dsa-1',
    question: 'Two Sum: Find indices of two numbers that add up to a target with O(n) time complexity.',
    difficulty: 'Easy',
    topic: 'DSA',
    interviewType: 'Coding',
    estimatedTime: '15 mins',
    hints: [
      'A brute force nested loop takes O(n²). Can we trade space for time?',
      'As you iterate, compute the complement: target - current_number.',
      'Use a Hash Map to store previously visited numbers and their indices for O(1) lookup.'
    ],
    expectedConcepts: [
      'Hash Map / Hash Table lookup in O(1)',
      'One-pass linear scan',
      'Space-time trade-off (O(n) time and O(n) space)',
      'Handling duplicate values and negative integers'
    ],
    answerDiscussion: `### Optimal Solution Analysis

1. **Intuition**: Rather than comparing every pair of numbers with nested loops ($O(n^2)$), we can remember each number we have already seen in a Hash Map.
2. **Algorithm**:
   - Initialize an empty Map: \`seen = new Map()\`.
   - For each element \`nums[i]\`, calculate \`complement = target - nums[i]\`.
   - If \`seen.has(complement)\`, return \`[seen.get(complement), i]\`.
   - Otherwise, store \`seen.set(nums[i], i)\`.
3. **Complexity**:
   - **Time Complexity**: $O(n)$ where $n$ is the number of elements (single pass).
   - **Space Complexity**: $O(n)$ to store up to $n$ entries in the hash map.
4. **Edge Cases**:
   - Array with negative numbers (e.g. \`[-3, 4, 3], target = 0\`).
   - Duplicate values that sum to target (e.g. \`[3, 3], target = 6\`).`
  },
  {
    id: 'dsa-2',
    question: 'LRU Cache: Design and implement a data structure for Least Recently Used (LRU) cache with O(1) get and put.',
    difficulty: 'Hard',
    topic: 'DSA',
    interviewType: 'Coding',
    estimatedTime: '40 mins',
    hints: [
      'A Hash Map gives O(1) key-value lookup, but does not maintain usage ordering.',
      'A Doubly Linked List allows O(1) removal and insertion of nodes at both ends.',
      'Combine a Hash Map with a Doubly Linked List with dummy head and tail nodes.'
    ],
    expectedConcepts: [
      'Doubly Linked List node mechanics (prev, next pointers)',
      'Hash Map storing key -> Node pointers',
      'O(1) eviction of Least Recently Used node at tail',
      'Moving accessed nodes to the head on get() and put()',
      'Boundary conditions with capacity limits'
    ],
    answerDiscussion: `### Optimal Solution Analysis

1. **Architecture**:
   - **Doubly Linked List**: Keeps track of recency. The most recently used item is placed right after the dummy \`head\`, and the least recently used item sits right before the dummy \`tail\`.
   - **Hash Map**: Maps \`key\` directly to the corresponding \`Node\` object in the doubly linked list.
2. **Operations**:
   - \`get(key)\`: Look up the node in the map. If not found, return -1. If found, move the node to the head of the linked list (remove node, insert right after head), then return \`node.value\`.
   - \`put(key, value)\`: If key exists, update value and move to head. If key does not exist: create a new node, insert at head, and store in map. If size exceeds \`capacity\`, evict the node immediately before \`tail\`, delete its key from the map, and decrement size.
3. **Complexity**:
   - \`get\`: $O(1)$ time.
   - \`put\`: $O(1)$ time.
   - Space: $O(\\text{capacity})$ for the nodes and map.`
  },
  {
    id: 'dsa-3',
    question: 'Valid Parentheses: Determine if an input string with brackets "()[]{}" is valid and correctly nested.',
    difficulty: 'Easy',
    topic: 'DSA',
    interviewType: 'Coding',
    estimatedTime: '15 mins',
    hints: [
      'The most recently opened bracket must be the first one closed (Last-In, First-Out).',
      'Use a Stack data structure.',
      'Check if the stack is completely empty at the end of iteration.'
    ],
    expectedConcepts: [
      'Stack LIFO property',
      'Character mapping table for bracket pairs',
      'Early return on unmatched closing bracket or empty stack pop',
      'Handling odd-length strings immediately'
    ],
    answerDiscussion: `### Optimal Solution Analysis

1. **Approach**:
   - If string length is odd, return \`false\` immediately.
   - Iterate through characters using a stack:
     - Push opening brackets \`(\`, \`[\`, \`{\` onto the stack.
     - When encountering a closing bracket, check whether the stack is non-empty and whether \`stack.pop()\` matches the closing bracket's corresponding opening type.
   - At the end, return \`stack.length === 0\`.
2. **Complexity**:
   - **Time**: $O(n)$ where $n$ is string length.
   - **Space**: $O(n)$ in the worst case (all opening brackets).`
  },
  {
    id: 'dsa-4',
    question: 'Coin Change: Compute the fewest number of coins needed to make up a given amount using dynamic programming.',
    difficulty: 'Medium',
    topic: 'DSA',
    interviewType: 'Coding',
    estimatedTime: '25 mins',
    hints: [
      'Greedy choice does not always work (e.g. coins [1, 3, 4] for amount 6: greedy gives 4+1+1 = 3 coins, but 3+3 = 2 coins is optimal).',
      'Define DP state: dp[i] represents the minimum coins needed for amount i.',
      'Transition: dp[i] = min(dp[i], dp[i - coin] + 1) for each coin <= i.'
    ],
    expectedConcepts: [
      'Bottom-up Tabulation vs Top-down Memoization',
      'Subproblem breakdown and optimal substructure',
      'Initial state initialization (infinity / amount + 1)',
      'Time complexity $O(amount \\times n)$ and space $O(amount)$'
    ],
    answerDiscussion: `### Optimal Solution Analysis

1. **DP Formulation**:
   - Let \`dp[a]\` be the minimum coins required for amount \`a\`.
   - Base case: \`dp[0] = 0\`.
   - For every amount from 1 to \`amount\`, initialize \`dp[a] = Infinity\`.
   - For each coin in \`coins\`:
     - If \`a - coin >= 0\`, \`dp[a] = Math.min(dp[a], dp[a - coin] + 1)\`.
2. **Result**:
   - Return \`dp[amount] === Infinity ? -1 : dp[amount]\`.
3. **Complexity**:
   - **Time**: $O(\\text{amount} \\times \\text{coins.length})$.
   - **Space**: $O(\\text{amount})$ array.`
  },

  // =========================================================================
  // 2. JAVASCRIPT
  // =========================================================================
  {
    id: 'js-1',
    question: 'Implement a complete debounce function in JavaScript supporting arguments forwarding and context preservation.',
    difficulty: 'Medium',
    topic: 'JavaScript',
    interviewType: 'Coding',
    estimatedTime: '20 mins',
    hints: [
      'Use a variable in the outer closure to store the timer ID.',
      'Whenever the returned wrapper is invoked, clear any existing timeout using clearTimeout.',
      'Set a new timeout to execute the callback with the preserved \`this\` and argument list.'
    ],
    expectedConcepts: [
      'Lexical closures & state persistence',
      'Event loop timers (setTimeout / clearTimeout)',
      'Preserving \`this\` context with \`.apply()\` or \`.call()\`',
      'Rest parameters \`...args\` forwarding',
      'Difference between debounce and throttle'
    ],
    answerDiscussion: `### Complete Implementation & Deep Dive

\`\`\`javascript
function debounce(func, wait) {
  let timeoutId = null;
  return function(...args) {
    const context = this;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(context, args);
      timeoutId = null;
    }, wait);
  };
}
\`\`\`

#### Key Interview Points:
1. **Debounce vs Throttle**: Debounce postpones execution until a specified quiet period passes without new calls (e.g. search input autocomplete). Throttle guarantees execution at most once per interval (e.g. window resize/scroll).
2. **Context Preservation**: Arrow functions or \`func.apply(context, args)\` ensure the method retains access to its calling instance (e.g., in React class components or DOM event targets).`
  },
  {
    id: 'js-2',
    question: 'Explain the JavaScript Event Loop in detail: Call Stack, Web APIs, Microtask Queue (Promises, queueMicrotask), and Macrotask Queue.',
    difficulty: 'Medium',
    topic: 'JavaScript',
    interviewType: 'Technical',
    estimatedTime: '20 mins',
    hints: [
      'JavaScript is single-threaded with a non-blocking concurrency model.',
      'Which queue is prioritized first after the current call stack clears?',
      'Walk through an example with console.log, setTimeout, and Promise.resolve().then.'
    ],
    expectedConcepts: [
      'Call Stack execution frame',
      'Microtasks (Promise callbacks, MutationObserver, queueMicrotask)',
      'Macrotasks (setTimeout, setInterval, I/O, UI rendering)',
      'Microtask queue exhaustion before next macrotask or browser repaint',
      'Starvation risk if recursive microtasks are scheduled'
    ],
    answerDiscussion: `### JavaScript Event Loop Walkthrough

1. **Call Stack**: Executes synchronous JavaScript instructions until empty.
2. **Web APIs / Background Threads**: Handles asynchronous operations (HTTP requests, timers, DOM events). When ready, pushes callback to respective queues.
3. **Queue Priorities**:
   - **Microtask Queue**: Has highest priority. When the call stack empties, the event loop drains **ALL** microtasks until the queue is completely empty (including new microtasks queued during execution).
   - **Macrotask Queue**: Executes exactly ONE macrotask per tick, then immediately checks and drains the microtask queue, followed by browser UI rendering.
4. **Classic Code Output Example**:
   \`\`\`javascript
   console.log('1'); // Synchronous
   setTimeout(() => console.log('2'), 0); // Macrotask
   Promise.resolve().then(() => console.log('3')); // Microtask
   console.log('4'); // Synchronous
   // Output: 1, 4, 3, 2
   \`\`\``
  },
  {
    id: 'js-3',
    question: 'How does prototypal inheritance work in JavaScript? Explain the prototype chain, Object.create(), and how ES6 classes desugar.',
    difficulty: 'Hard',
    topic: 'JavaScript',
    interviewType: 'Technical',
    estimatedTime: '25 mins',
    hints: [
      'Every object in JavaScript has an internal [[Prototype]] link (__proto__).',
      'Property lookups traverse up this chain until null is reached.',
      'ES6 classes are syntactic sugar over constructor functions and prototype objects.'
    ],
    expectedConcepts: [
      '[[Prototype]] and __proto__ vs .prototype property on constructor functions',
      'Prototype chain lookup termination at Object.prototype (then null)',
      'Object.create(proto) for explicit prototype setting',
      'ES6 class and extends under the hood',
      'Memory efficiency of prototype sharing across instances'
    ],
    answerDiscussion: `### Prototypal Inheritance Mechanics

In JavaScript, objects inherit directly from other objects via a hidden property named \`[[Prototype]]\`.
1. **Lookup Mechanism**:
   - When accessing \`obj.prop\`, JS checks \`obj\` directly.
   - If not found, it checks \`obj.__proto__\` (which references \`Constructor.prototype\`).
   - This continues up the chain until reaching \`Object.prototype.__proto__\` which is \`null\`.
2. **ES6 Classes**:
   - The \`class\` syntax is syntactic sugar.
   - Methods declared in a class body are placed on the class's \`prototype\` object (e.g. \`User.prototype.login\`), sharing memory across all instances.`
  },

  // =========================================================================
  // 3. REACT
  // =========================================================================
  {
    id: 'react-1',
    question: 'Compare useEffect, useLayoutEffect, and useMemo. When does using useLayoutEffect prevent visual flickering?',
    difficulty: 'Medium',
    topic: 'React',
    interviewType: 'Technical',
    estimatedTime: '20 mins',
    hints: [
      'Think about the timeline: Render phase -> DOM mutation -> Layout calculation -> Screen Paint.',
      'useLayoutEffect fires synchronously right after DOM mutations, before paint.',
      'useEffect fires asynchronously after browser paint.'
    ],
    expectedConcepts: [
      'Browser render cycle (DOM update -> Layout/Style -> Paint -> Composite)',
      'useLayoutEffect synchronous execution blocking paint',
      'useEffect asynchronous non-blocking scheduling',
      'useMemo memoizing calculated references between renders',
      'DOM dimension measurements (getBoundingClientRect) preventing layout shifts'
    ],
    answerDiscussion: `### Detailed Comparison

| Hook | Timing | Paint Blocking? | Primary Use Case |
|---|---|---|---|
| \`useEffect\` | Asynchronous (after browser paint) | No | Data fetching, event listeners, analytics, state sync |
| \`useLayoutEffect\` | Synchronous (after DOM mutation, before paint) | Yes | Measuring DOM node dimensions, tooltip positioning, layout shifts |
| \`useMemo\` | Synchronous during render phase | N/A | Caching computationally heavy values between re-renders |

#### Preventing Visual Flickering:
If you need to measure an element's DOM height and adjust another element's position based on it, doing so in \`useEffect\` renders with initial layout, paints to screen, triggers an update, and paints again—causing a visible jitter/flicker. \`useLayoutEffect\` updates the DOM before the browser can paint, rendering the final coordinates in a single frame.`
  },
  {
    id: 'react-2',
    question: 'How does React\'s Fiber Architecture and Reconciliation work? Explain Keys, Diffing Algorithm, and Concurrent Mode.',
    difficulty: 'Hard',
    topic: 'React',
    interviewType: 'Technical',
    estimatedTime: '30 mins',
    hints: [
      'The legacy Stack reconciler could not pause or interrupt work during large tree updates.',
      'Fiber represents work units as a linked list (child, sibling, return).',
      'Why are stable keys critical for list diffing rather than index?'
    ],
    expectedConcepts: [
      'Stack Reconciler vs Fiber Reconciler',
      'Work units split into chunked time slices via requestIdleCallback/MessageChannel',
      'Two phases: Render phase (interruptible) vs Commit phase (synchronous DOM mutations)',
      'Heuristic diffing assumptions: different types yield different trees; keys match across renders',
      'Dangers of using array index as key during item insertions/deletions'
    ],
    answerDiscussion: `### React Fiber & Reconciliation Deep Dive

1. **Why Fiber was Created**:
   - The original Stack Reconciler operated synchronously and recursively. Large tree updates blocked the browser main thread, causing dropped frames and laggy input responses.
   - Fiber re-implemented the component tree as a mutable linked list where each component is a "Fiber node". Work can be paused, prioritized, aborted, or resumed across frames.
2. **Two Phases**:
   - **Render / Reconciliation Phase**: Computes the diff between current and new fiber trees. Pure, asynchronous, and interruptible.
   - **Commit Phase**: Applies mutations to the real DOM. Synchronous to prevent inconsistent UI states.
3. **The Importance of Keys**:
   - Keys allow React to track identity across renders. Using array indices leads to state bugs when inserting, reordering, or deleting elements because index values shift.`
  },
  {
    id: 'react-3',
    question: 'Design a reusable custom hook `useDebouncedFetch` that cancels stale requests using AbortController and caches responses.',
    difficulty: 'Medium',
    topic: 'React',
    interviewType: 'Coding',
    estimatedTime: '25 mins',
    hints: [
      'Store cached responses in a Map ref or state.',
      'Create an AbortController instance on each fetch and call controller.abort() in the cleanup return.',
      'Debounce the fetch trigger using setTimeout.'
    ],
    expectedConcepts: [
      'Custom Hook composition with useEffect, useState, useRef',
      'AbortController and signal cleanup to prevent race conditions',
      'Debounce delay handling within React effect lifecycle',
      'In-memory cache Map lookup',
      'Handling loading, error, and data states'
    ],
    answerDiscussion: `### Implementation of \`useDebouncedFetch\`

\`\`\`javascript
import { useState, useEffect, useRef } from 'react';

export function useDebouncedFetch(url, delay = 300) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cacheRef = useRef(new Map());

  useEffect(() => {
    if (!url) return;
    if (cacheRef.current.has(url)) {
      setData(cacheRef.current.get(url));
      setLoading(false);
      return;
    }

    const abortController = new AbortController();
    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(url, { signal: abortController.signal });
        if (!res.ok) throw new Error('Network error: ' + res.status);
        const json = await res.json();
        cacheRef.current.set(url, json);
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [url, delay]);

  return { data, loading, error };
}
\`\`\``
  },

  // =========================================================================
  // 4. PYTHON
  // =========================================================================
  {
    id: 'python-1',
    question: 'Explain Python Generators, the `yield` keyword, and why they provide significant memory efficiency over list comprehensions.',
    difficulty: 'Easy',
    topic: 'Python',
    interviewType: 'Technical',
    estimatedTime: '15 mins',
    hints: [
      'List comprehensions compute and allocate all elements in memory immediately.',
      'Generators produce items on demand using lazy evaluation.',
      'What happens when you call next() on a generator object?'
    ],
    expectedConcepts: [
      'Lazy evaluation vs eager evaluation',
      'Generator functions with yield vs generator expressions (x for x in ...)',
      'Iterator protocol (__iter__ and __next__)',
      'Memory consumption comparison for large datasets (10M rows)',
      'StopIteration exception'
    ],
    answerDiscussion: `### Python Generators Deep Dive

1. **How \`yield\` Works**:
   - A function containing \`yield\` returns a generator object without executing the body immediately.
   - When \`next(gen)\` is called, execution proceeds until the \`yield\` statement, emits the value, and **freezes its execution state** (local variables and instruction pointer).
2. **Memory Efficiency**:
   - Generating 10 million integers in a list: \`[x for x in range(10_000_000)]\` consumes ~400 MB of RAM.
   - The generator expression \`(x for x in range(10_000_000))\` consumes ~128 bytes, producing integers one at a time.
3. **Use Cases**:
   - Streaming large log files, database cursor pagination, pipelines of infinite streams.`
  },
  {
    id: 'python-2',
    question: 'How does the Python Global Interpreter Lock (GIL) work, and how does it affect CPU-bound vs I/O-bound multithreaded applications?',
    difficulty: 'Medium',
    topic: 'Python',
    interviewType: 'Technical',
    estimatedTime: '20 mins',
    hints: [
      'The GIL is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes at once.',
      'Why does I/O-bound work benefit from threading even with the GIL?',
      'How does multiprocessing circumvent the GIL for CPU-bound tasks?'
    ],
    expectedConcepts: [
      'CPython reference counting memory management',
      'GIL mutex ensuring thread safety of internal structures',
      'CPU-bound tasks: threading causes overhead due to lock contention; use multiprocessing',
      'I/O-bound tasks: threads release the GIL during syscalls (network, disk I/O)',
      'Python 3.13 free-threaded mode (PEP 703)'
    ],
    answerDiscussion: `### The Global Interpreter Lock (GIL)

1. **What is the GIL**:
   - A mutex in CPython that prevents multiple native threads from executing Python bytecodes simultaneously. CPython uses reference counting for garbage collection, and without the GIL, race conditions could corrupt memory.
2. **Impact on Performance**:
   - **I/O-Bound Work**: Python releases the GIL when performing I/O operations (file read, socket communication, database queries). Standard threads or \`asyncio\` provide excellent concurrency.
   - **CPU-Bound Work**: Multithreading does not utilize multi-core processors for Python bytecode. Threads contend for the GIL, often running slower than single-threaded code.
3. **Solutions for CPU-Bound Parallelism**:
   - Use the \`multiprocessing\` module (separate OS processes with dedicated Python interpreters and memories).
   - Offload heavy compute to C/Rust extensions (e.g. NumPy, PyTorch) which release the GIL.`
  },
  {
    id: 'python-3',
    question: 'Write a Python decorator `@retry(max_attempts=3, delay=1)` that automatically retries an operation if an exception occurs.',
    difficulty: 'Medium',
    topic: 'Python',
    interviewType: 'Coding',
    estimatedTime: '20 mins',
    hints: [
      'Decorators that accept arguments require 3 layers of nested functions.',
      'Use functools.wraps to preserve function metadata (docstring, name).',
      'Catch exceptions in a loop and sleep between attempts.'
    ],
    expectedConcepts: [
      'Higher-order functions and closures in Python',
      'Three-level decorator structure (decorator factory -> decorator -> wrapper)',
      '@functools.wraps preserving __name__ and __doc__',
      'Exception catching and time.sleep backoff',
      '*args and **kwargs parameter forwarding'
    ],
    answerDiscussion: `### Complete Decorator Implementation

\`\`\`python
import time
import functools

def retry(max_attempts=3, delay=1):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            attempts = 0
            while attempts < max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempts += 1
                    if attempts == max_attempts:
                        raise e
                    time.sleep(delay)
        return wrapper
    return decorator

# Usage:
@retry(max_attempts=3, delay=0.5)
def fetch_remote_data():
    # Simulates network call
    pass
\`\`\``
  },

  // =========================================================================
  // 5. JAVA
  // =========================================================================
  {
    id: 'java-1',
    question: 'How does HashMap work internally in Java? Explain hashing, buckets, collision resolution, and the Java 8 Treeify threshold.',
    difficulty: 'Medium',
    topic: 'Java',
    interviewType: 'Technical',
    estimatedTime: '25 mins',
    hints: [
      'HashMap is backed by an array of Node<K, V>.',
      'How is the array index calculated from key.hashCode()?',
      'In Java 8, when a linked list bucket exceeds 8 elements, what does it convert into?'
    ],
    expectedConcepts: [
      'hashCode() and equals() contract',
      'Bitwise index calculation: (n - 1) & hash',
      'Linked List chaining for collisions (pre-Java 8)',
      'Red-Black Tree conversion (TREEIFY_THRESHOLD = 8)',
      'Load factor (default 0.75) and rehashing / resizing array by 2x',
      'Why HashMap is not thread-safe (ConcurrentHashMap alternative)'
    ],
    answerDiscussion: `### Internal Architecture of Java HashMap

1. **Underlying Structure**:
   - An array of buckets (\`Node<K, V>[] table\`). Default initial capacity is 16.
2. **Index Calculation**:
   - \`hash = key.hashCode() ^ (hash >>> 16)\` (supplemental hash to distribute high-order bits).
   - \`index = (table.length - 1) & hash\` (bitwise AND, equivalent to modulo for powers of 2).
3. **Collision Handling**:
   - **Separate Chaining**: If multiple keys map to the same bucket, entries are chained in a singly linked list.
   - **Java 8 Optimization**: When a bucket contains $\\ge 8$ elements and table capacity is $\\ge 64$, the linked list converts into a **Balanced Red-Black Tree** (\`TreeNode\`).
   - This improves worst-case lookup time from $O(n)$ to $O(\\log n)$.
4. **Resizing**:
   - When elements exceed \`capacity * loadFactor\` (default $16 \\times 0.75 = 12$), capacity doubles to 32 and elements are rehashed.`
  },
  {
    id: 'java-2',
    question: 'Compare `synchronized` keyword vs `ReentrantLock` in Java Concurrency. When would you explicitly prefer ReentrantLock?',
    difficulty: 'Medium',
    topic: 'Java',
    interviewType: 'Technical',
    estimatedTime: '20 mins',
    hints: [
      'synchronized is a built-in language feature; ReentrantLock is an API class from java.util.concurrent.locks.',
      'Can synchronized support timeout-based lock acquisition?',
      'How does fairness policy (FIFO grant) work in ReentrantLock?'
    ],
    expectedConcepts: [
      'Intrinsic monitor lock vs explicit lock',
      'Automatic lock release (synchronized) vs explicit lock.unlock() in finally block',
      'tryLock() with timeouts',
      'Fairness parameter (new ReentrantLock(true))',
      'Multiple Condition variables (await/signal) vs single wait/notify'
    ],
    answerDiscussion: `### synchronized vs ReentrantLock Comparison

| Feature | \`synchronized\` | \`ReentrantLock\` |
|---|---|---|
| **Mechanism** | JVM intrinsic monitor | Library class (\`java.util.concurrent.locks\`) |
| **Acquisition** | Implicit (block or method) | Explicit (\`lock.lock()\`) |
| **Release** | Automatic on block exit | Manual: **MUST** be placed in \`finally\` block |
| **Non-blocking Try** | No | Yes: \`lock.tryLock()\` and \`tryLock(timeout)\` |
| **Interruptible** | No | Yes: \`lock.lockInterruptibly()\` |
| **Fairness** | Unfair only | Optional: \`new ReentrantLock(true)\` (FIFO) |
| **Condition Variables** | Single wait/notify | Multiple: \`lock.newCondition()\` |

#### When to choose ReentrantLock:
When you need timeout-based lock acquisition to prevent deadlocks, interruptible lock waiting, multiple wait-conditions (e.g. producer-consumer buffers), or guaranteed fairness.`
  },

  // =========================================================================
  // 6. SQL
  // =========================================================================
  {
    id: 'sql-1',
    question: 'Explain SQL Window Functions with practical examples: Compare `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()`.',
    difficulty: 'Easy',
    topic: 'SQL',
    interviewType: 'Technical',
    estimatedTime: '20 mins',
    hints: [
      'Window functions compute values across a group of rows without collapsing rows like GROUP BY does.',
      'The OVER (PARTITION BY ... ORDER BY ...) clause defines the window.',
      'How do the three functions handle identical values (ties)?'
    ],
    expectedConcepts: [
      'OVER() clause, PARTITION BY, and ORDER BY',
      'ROW_NUMBER(): strictly unique sequential integers (1, 2, 3, 4)',
      'RANK(): identical rank for ties, skips subsequent ranks (1, 2, 2, 4)',
      'DENSE_RANK(): identical rank for ties, does not skip ranks (1, 2, 2, 3)',
      'Common usage: Finding the top N highest earners per department'
    ],
    answerDiscussion: `### SQL Window Functions & Tie Resolution

Window functions evaluate calculations over a set of table rows related to the current row, preserving individual row identities:

\`\`\`sql
SELECT 
  employee_id,
  department_id,
  salary,
  ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS row_num,
  RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rank_num,
  DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS dense_rank_num
FROM employees;
\`\`\`

#### Behavior on Tied Salaries ($100k, $90k, $90k, $80k):
- **\`ROW_NUMBER()\`**: 1, 2, 3, 4 (arbitrary tie-break).
- **\`RANK()\`**: 1, 2, 2, 4 (gaps introduced).
- **\`DENSE_RANK()\`**: 1, 2, 2, 3 (no gaps).`
  },
  {
    id: 'sql-2',
    question: 'How do B-Tree indexes work in relational databases, and what query patterns prevent the query planner from using an index?',
    difficulty: 'Medium',
    topic: 'SQL',
    interviewType: 'Technical',
    estimatedTime: '25 mins',
    hints: [
      'B-Tree indexes maintain sorted keys with log(n) search and range scans.',
      'What happens when you wrap an indexed column in a function like LOWER(name)?',
      'Think about wildcard prefix matches: LIKE "%abc" vs LIKE "abc%".'
    ],
    expectedConcepts: [
      'B-Tree node balancing, leaf nodes linked lists for range queries',
      'Index Seek vs Index Scan vs Full Table Scan',
      'Leftmost Prefix Rule for composite indexes (colA, colB)',
      'Function calls on columns preventing index usage (e.g. YEAR(created_at) = 2024)',
      'Implicit type conversions disabling indexes'
    ],
    answerDiscussion: `### B-Tree Indexes & Anti-Patterns

1. **How B-Trees Work**:
   - Balanced tree structure with $O(\\log N)$ lookup, insertion, and deletion.
   - Leaf nodes are connected as a doubly linked list, enabling fast range scans (\`BETWEEN\`, \`>\`, \`<\`).
2. **Patterns That Defeat Indexes**:
   - **Functions on Columns**: \`WHERE LOWER(email) = 'test@example.com'\` forces a full table scan. Solution: Create a functional index or query with exact case.
   - **Leading Wildcard**: \`WHERE username LIKE '%smith'\` cannot use the index because the search prefix is unknown.
   - **Mismatched Types**: If \`phone\` is VARCHAR and queried as \`WHERE phone = 1234567890\`, the database applies implicit conversion \`TO_CHAR(phone)\`, bypassing the index.
   - **Ignoring Leftmost Prefix**: On index \`(last_name, first_name)\`, filtering by \`WHERE first_name = 'Alice'\` cannot seek the index.`
  },

  // =========================================================================
  // 7. SYSTEM DESIGN
  // =========================================================================
  {
    id: 'sys-1',
    question: 'Design a Distributed Rate Limiter: Compare Token Bucket and Sliding Window Log algorithms with Redis and Lua scripts.',
    difficulty: 'Hard',
    topic: 'System Design',
    interviewType: 'System Design',
    estimatedTime: '35 mins',
    hints: [
      'Start with functional and non-functional requirements (high throughput, low latency, distributed precision).',
      'Token Bucket accommodates bursts; Sliding Window prevents boundary spike attacks.',
      'Why are atomic Lua scripts essential in Redis to avoid race conditions?'
    ],
    expectedConcepts: [
      'Token Bucket vs Leaky Bucket vs Sliding Window Counter',
      'Centralized caching state with Redis sorted sets / hashes',
      'Atomic evaluation via Redis Lua scripts (evalsha)',
      'HTTP 429 Too Many Requests response with X-RateLimit headers',
      'Fallback / graceful degradation during cache outages'
    ],
    answerDiscussion: `### System Architecture for Distributed Rate Limiter

1. **Requirements**:
   - **Functional**: Limit requests per client ID / IP (e.g. 100 requests/minute). Return HTTP 429 when quota exceeded.
   - **Non-Functional**: Under 5ms overhead, highly available, distributed consistency across multiple API gateway nodes.
2. **Algorithm Comparison**:
   - **Token Bucket**: Stores token count and last refill timestamp. Lightweight (few bytes per user). Allows controlled bursts.
   - **Sliding Window Counter**: Tracks request counts across current and previous sub-windows. Eliminates the double-burst boundary vulnerability of fixed windows.
3. **Distributed Implementation**:
   - API Gateways forward the client key to a Redis cluster.
   - An **atomic Lua script** retrieves the token count, calculates refill tokens based on \`current_time - last_refill\`, decrements the token, and writes back.
   - Because Redis executes Lua scripts atomically on a single thread, race conditions (check-then-act) between concurrent requests are eliminated.
4. **Resiliency**: If Redis is unreachable, fail-open to preserve core availability, logging security warnings.`
  },
  {
    id: 'sys-2',
    question: 'Design a Scalable URL Shortener service (like TinyURL) handling 100M URLs generated per month and 10B clicks.',
    difficulty: 'Medium',
    topic: 'System Design',
    interviewType: 'System Design',
    estimatedTime: '35 mins',
    hints: [
      'Calculate read-to-write ratio (100:1 read heavy).',
      'Choose encoding scheme: Base62 encoding ([a-zA-Z0-9]) with 7 characters gives 62^7 = 3.5 trillion URLs.',
      'How do you generate unique IDs without collisions? (Distributed ID generators like Snowflake or pre-generated ranges).'
    ],
    expectedConcepts: [
      'Capacity estimation (Storage, QPS, Bandwidth)',
      'Base62 encoding of 64-bit integer IDs',
      'Collision resolution vs Counter-based / Snowflake ID generation',
      'Database choice (NoSQL key-value store or PostgreSQL with B-Tree on hash)',
      'Read-heavy caching layer with Redis (LRU eviction)',
      'HTTP 301 Permanent Redirect vs 302 Temporary Redirect (analytics tracking)'
    ],
    answerDiscussion: `### TinyURL High-Level Design

1. **Estimations**:
   - 100M new URLs / month $\\approx 40$ writes/sec.
   - 10B reads / month $\\approx 4,000$ reads/sec (read-heavy, ratio 100:1).
2. **Short Key Generation**:
   - Use Base62 characters: \`0-9\`, \`a-z\`, \`A-Z\` (62 characters).
   - A 7-character string supports $62^7 \\approx 3.52 \\times 10^{12}$ unique URLs.
   - Use a distributed unique ID generator (e.g. Twitter Snowflake or DB range allocation service) to produce a 64-bit integer, then convert directly to Base62.
3. **Storage & Data Model**:
   - Table: \`short_code (PK)\`, \`original_url\`, \`created_at\`, \`expires_at\`, \`user_id\`.
   - Stored in a distributed Key-Value store (e.g., DynamoDB / Cassandra) for fast O(1) lookups.
4. **Caching & Redirects**:
   - Cache top 20% hot URLs in Redis (80/20 rule).
   - Return **HTTP 302** (Temporary Redirect) so requests hit the backend, allowing telemetry and click analytics tracking (unlike HTTP 301 which browsers cache locally).`
  },

  // =========================================================================
  // 8. HR (Human Resources & Cultural Fit)
  // =========================================================================
  {
    id: 'hr-1',
    question: 'Tell me about yourself, your technical background, and what motivated you to apply for this engineering role.',
    difficulty: 'Easy',
    topic: 'HR',
    interviewType: 'HR',
    estimatedTime: '15 mins',
    hints: [
      'Keep it within 90 to 120 seconds.',
      'Structure chronologically: Present role -> Impressive Past Achievements -> Future fit with this company.',
      'Connect your genuine interests directly to the company mission.'
    ],
    expectedConcepts: [
      'Concise elevator pitch format (Present -> Past -> Future)',
      'Highlighting quantifiable achievements rather than just job duties',
      'Demonstrating research into the company product and culture',
      'Clear, confident vocal pacing without rambling'
    ],
    answerDiscussion: `### Structure of an Exceptional Elevator Pitch

1. **Present (30 seconds)**:
   - "I am currently a Software Engineer specializing in full-stack web architectures, building scalable services with React, Node.js, and cloud backends."
2. **Past (45 seconds)**:
   - "Over the last 3 years, I spearheaded the migration of our legacy monolith to containerized microservices, reducing deployment latency by 45% and eliminating single points of failure. I love tackling distributed systems problems and mentoring junior developers."
3. **Future & Why This Company (30 seconds)**:
   - "I have been following your team's work on developer tooling and high-concurrency cloud infrastructure. This role sits right at the intersection of my technical passions and where I can make an immediate impact."`
  },
  {
    id: 'hr-2',
    question: 'Where do you see yourself in five years in terms of technical leadership and professional growth?',
    difficulty: 'Easy',
    topic: 'HR',
    interviewType: 'HR',
    estimatedTime: '15 mins',
    hints: [
      'Demonstrate ambition while remaining realistic and committed to long-term impact.',
      'Discuss both technical mastery and mentorship/leadership progression.',
      'Highlight how the target company provides the right environment to reach those milestones.'
    ],
    expectedConcepts: [
      'Technical depth vs architectural breadth roadmap',
      'Mentorship, code review standards, and team multiplier mindset',
      'Alignment with engineering career ladders (Senior / Staff Engineer or Tech Lead)',
      'Continuous learning and ownership'
    ],
    answerDiscussion: `### Recommended Response Framework

- **Technical Progression**: "In five years, I aim to have grown into a Staff Engineer / Tech Lead role, taking end-to-end architectural ownership of mission-critical systems."
- **Team Impact**: "Beyond shipping code, I want to be a force multiplier—establishing engineering standards, driving architectural RFCs, and mentoring junior engineers into senior contributors."
- **Company Alignment**: "I view this team as an ideal environment because of the high technical bar and ambitious roadmap, where I can build deep institutional expertise."`
  },
  {
    id: 'hr-3',
    question: 'How do you handle high-pressure deadlines, scope changes, and maintain sustainable work-life balance?',
    difficulty: 'Medium',
    topic: 'HR',
    interviewType: 'HR',
    estimatedTime: '20 mins',
    hints: [
      'Acknowledge that crunch times happen, but emphasize proactive communication and triage.',
      'Discuss ruthless prioritization (MoSCoW framework or MVP scoping).',
      'Demonstrate self-awareness and sustainable pacing.'
    ],
    expectedConcepts: [
      'Proactive expectation management with Product Managers & stakeholders',
      'De-scoping non-critical features rather than sacrificing code quality or testing',
      'Transparent communication before deadlines are missed',
      'Preventing burnout through structured sprint pacing and retrospective reviews'
    ],
    answerDiscussion: `### Key Talking Points

1. **Triage & Transparent Communication**:
   - When scope expands or deadlines shift, the worst approach is silent overworking. Immediately align with PMs and leads to break down features into must-haves vs fast-followers.
2. **Protecting Core Quality**:
   - Cutting automated tests or skipping architecture reviews creates technical debt that causes production outages later. Scoping down surface area is preferred over cutting quality.
3. **Sustainable Performance**:
   - Establish sustainable work habits so the team can execute at a consistently high level over years without burnout.`
  },

  // =========================================================================
  // 9. BEHAVIORAL (STAR Method)
  // =========================================================================
  {
    id: 'beh-1',
    question: 'Describe a challenging technical problem or production outage you faced. How did you approach solving it, and what was the result? (STAR)',
    difficulty: 'Medium',
    topic: 'Behavioral',
    interviewType: 'Behavioral',
    estimatedTime: '25 mins',
    hints: [
      'Strictly use the STAR framework: Situation, Task, Action, Result.',
      'Focus on your personal actions using "I" instead of ambiguous "we".',
      'Quantify the result with measurable metrics (% uptime, latency reduction, customer impact).'
    ],
    expectedConcepts: [
      'Situation: Clear context and severity of problem',
      'Task: Exact objective you owned',
      'Action: Systematic debugging, root cause analysis, execution under pressure',
      'Result: Concrete metrics, post-mortem blameless culture, and prevention safeguards'
    ],
    answerDiscussion: `### Model STAR Answer

- **Situation**: "During a Black Friday traffic surge, our payment gateway service experienced an unexpected latency spike from 200ms to 4.5 seconds, triggering checkout timeouts for 12% of active shoppers."
- **Task**: "As the on-call backend engineer, my objective was to identify the root cause, mitigate immediate customer failures within 15 minutes, and implement permanent architectural prevention."
- **Action**: "I examined distributed traces in Datadog and identified database connection pool exhaustion caused by unindexed promo code queries. I immediately scaled our read replicas, enabled query connection pooling with pgbouncer, and pushed an index migration. Afterwards, I conducted a blameless post-mortem and added automated load-testing assertions to our CI pipeline."
- **Result**: "Checkout latency normalized to 180ms within 11 minutes of detection. In the subsequent holiday rush, our service maintained 99.99% uptime with zero pool saturation."`
  },
  {
    id: 'beh-2',
    question: 'Tell me about a time you had a strong technical disagreement with a peer or Tech Lead. How did you handle it and what was the outcome? (STAR)',
    difficulty: 'Medium',
    topic: 'Behavioral',
    interviewType: 'Behavioral',
    estimatedTime: '20 mins',
    hints: [
      'Show that you separate technical arguments from personal egos.',
      'Use data, prototypes, and benchmarking to resolve decisions objectively.',
      'Demonstrate "disagree and commit" when appropriate.'
    ],
    expectedConcepts: [
      'Focusing on shared engineering and business goals',
      'Gathering objective metrics / benchmark POCs rather than opinion debates',
      'Active listening and acknowledging the other perspective\'s valid points',
      'Disagree and commit principle (Amazon leadership principle)'
    ],
    answerDiscussion: `### Model STAR Answer

- **Situation**: "Our team was redesigning our real-time notification engine. My Tech Lead favored long-polling HTTP due to familiarity, while I advocated for WebSockets with Redis pub/sub to reduce server memory overhead at scale."
- **Task**: "I needed to evaluate both approaches rigorously without stalling sprint velocity or creating interpersonal friction."
- **Action**: "I scheduled a 30-minute sync to understand his concerns—which centered on operational debugging complexity. Over the weekend, I built a lightweight benchmark Proof-of-Concept testing 50,000 concurrent connections. The benchmark showed long-polling consumed 8x more server instances and $4,200 more per month. I presented the findings in an architectural RFC with a detailed monitoring guide."
- **Result**: "The Tech Lead agreed with the data and approved the WebSocket architecture. We shipped on schedule and saved an estimated $45k annually in server compute."`
  },
  {
    id: 'beh-3',
    question: 'Tell me about a time you had to learn a completely new framework, language, or system under a tight deadline. How did you succeed? (STAR)',
    difficulty: 'Easy',
    topic: 'Behavioral',
    interviewType: 'Behavioral',
    estimatedTime: '15 mins',
    hints: [
      'Emphasize your adaptability and systematic learning strategy.',
      'Explain how you balanced rapid delivery with writing idiomatic, clean code.',
      'Mention seeking mentorship or consulting documentation efficiently.'
    ],
    expectedConcepts: [
      'Growth mindset and fast ramp-up methodology',
      'Targeted learning based on core patterns rather than reading entire manuals',
      'Shipping an MVP while soliciting code review feedback',
      'Documenting learnings for the rest of the team'
    ],
    answerDiscussion: `### Model STAR Answer

- **Situation**: "Our client requested an urgent integration with a third-party Rust cryptographic microservice, but our team was primarily TypeScript engineers."
- **Task**: "I volunteered to ramp up on Rust memory ownership rules and deliver the signed token exchange integration within 10 business days."
- **Action**: "I focused on Rust's concurrency primitives and FFI bindings. I built small integration test suites first (TDD) to validate compiler guarantees, reviewed idiomatic patterns from open-source repositories, and paired with a senior engineer from another department for a 45-minute code review."
- **Result**: "The integration shipped 2 days ahead of deadline with 100% test coverage. I also wrote an internal onboarding doc that helped two teammates ramp up on Rust the following month."`
  }
];
