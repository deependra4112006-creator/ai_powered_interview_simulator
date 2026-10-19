/**
 * Curated Coding Problems catalog for dedicated coding interview interface
 * Complete with descriptions, input/output formats, constraints, examples,
 * starter templates for JavaScript, Python, Java, C++, and C, and test cases.
 */

export const CODING_PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Medium',
    category: 'Array & Hash Table',
    acceptanceRate: '52.4%',
    timeTarget: '20 mins',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order. Can you achieve an algorithm with **O(n)** time complexity?`,
    inputFormat: 'An integer array `nums` of length `n`, and an integer `target`.',
    outputFormat: 'An array of two integers `[index1, index2]` representing the zero-based indices.',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists in the input array.'
    ],
    examples: [
      {
        id: 1,
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].'
      },
      {
        id: 2,
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2].'
      },
      {
        id: 3,
        input: 'nums = [3, 3], target = 6',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 3 + 3 == 6, we return [0, 1].'
      }
    ],
    hints: [
      'A brute force approach checks every pair using nested loops (O(n²)). Can we trade space for time?',
      'As you iterate through the array, calculate the complement needed to reach the target: `complement = target - nums[i]`.',
      'Use a Hash Map / Dictionary to store elements and their indices for O(1) average lookup time.'
    ],
    testCases: [
      {
        id: 'tc1',
        description: 'Standard ordered array with positive numbers',
        input: 'nums = [2, 7, 11, 15], target = 9',
        expectedOutput: '[0, 1]'
      },
      {
        id: 'tc2',
        description: 'Unordered array with non-consecutive elements',
        input: 'nums = [3, 2, 4], target = 6',
        expectedOutput: '[1, 2]'
      },
      {
        id: 'tc3',
        description: 'Array with duplicate target values',
        input: 'nums = [3, 3], target = 6',
        expectedOutput: '[0, 1]'
      }
    ],
    starterTemplates: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your solution here
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
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your solution here
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`,
      java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        unordered_map<int, int> numMap;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (numMap.find(complement) != numMap.end()) {
                return { numMap[complement], i };
            }
            numMap[nums[i]] = i;
        }
        return {};
    }
};`,
      c: `#include <stdio.h>
#include <stdlib.h>

/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Write your solution here
    int* result = (int*)malloc(2 * sizeof(int));
    *returnSize = 2;
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    *returnSize = 0;
    return NULL;
}`
    }
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack & String',
    acceptanceRate: '41.1%',
    timeTarget: '15 mins',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    inputFormat: 'A string `s` consisting of bracket characters.',
    outputFormat: 'A boolean value: `true` if the string is valid, `false` otherwise.',
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only: ()[]{}'
    ],
    examples: [
      {
        id: 1,
        input: 's = "()"',
        output: 'true',
        explanation: 'Simple matched parentheses pair.'
      },
      {
        id: 2,
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'Multiple types of parentheses matched in sequence.'
      },
      {
        id: 3,
        input: 's = "(]"',
        output: 'false',
        explanation: 'Opening round bracket is improperly closed with square bracket.'
      }
    ],
    hints: [
      'Think about the Last-In-First-Out (LIFO) property. Which data structure supports this?',
      'Push each opening bracket onto a stack. When encountering a closing bracket, verify that it matches the top of the stack.',
      'Remember edge cases: strings starting with a closing bracket or remaining unclosed brackets in the stack.'
    ],
    testCases: [
      {
        id: 'tc1',
        description: 'Sequence of different valid brackets',
        input: 's = "()[]{}"',
        expectedOutput: 'true'
      },
      {
        id: 'tc2',
        description: 'Mismatched closing bracket type',
        input: 's = "(]"',
        expectedOutput: 'false'
      },
      {
        id: 'tc3',
        description: 'Properly nested multi-layer brackets',
        input: 's = "{[()]}"',
        expectedOutput: 'true'
      }
    ],
    starterTemplates: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Write your solution here
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        # Write your solution here
        stack = []
        mapping = {')': '(', '}': '{', ']': '['}
        for char in s:
            if char in mapping:
                top = stack.pop() if stack else '#'
                if mapping[char] != top:
                    return False
            else:
                stack.append(char)
        return not stack`,
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
      cpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Write your solution here
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') st.push(c);
            else {
                if (st.empty()) return false;
                if (c == ')' && st.top() != '(') return false;
                if (c == '}' && st.top() != '{') return false;
                if (c == ']' && st.top() != '[') return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`,
      c: `#include <stdbool.h>
#include <string.h>

bool isValid(char* s) {
    // Write your solution here
    int len = strlen(s);
    char stack[len + 1];
    int top = -1;
    for (int i = 0; i < len; i++) {
        char c = s[i];
        if (c == '(' || c == '{' || c == '[') {
            stack[++top] = c;
        } else {
            if (top == -1) return false;
            char topChar = stack[top--];
            if (c == ')' && topChar != '(') return false;
            if (c == '}' && topChar != '{') return false;
            if (c == ']' && topChar != '[') return false;
        }
    }
    return top == -1;
}`
    }
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    acceptanceRate: '35.2%',
    timeTarget: '25 mins',
    description: `Given a string \`s\`, find the length of the **longest substring** without duplicate characters.

A substring is a contiguous non-empty sequence of characters within a string.`,
    inputFormat: 'A string `s` consisting of English letters, digits, symbols, and spaces.',
    outputFormat: 'An integer representing the maximum length of a non-repeating substring.',
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    examples: [
      {
        id: 1,
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        id: 2,
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        id: 3,
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    hints: [
      'Use a Sliding Window with two pointers: `left` and `right`.',
      'Maintain a set or map of characters currently in the window.',
      'When you see a duplicate, advance the `left` pointer until the duplicate character is removed from the window.'
    ],
    testCases: [
      {
        id: 'tc1',
        description: 'Standard repeated character sequence',
        input: 's = "abcabcbb"',
        expectedOutput: '3'
      },
      {
        id: 'tc2',
        description: 'Single character repeated',
        input: 's = "bbbbb"',
        expectedOutput: '1'
      },
      {
        id: 'tc3',
        description: 'Interleaved duplicates',
        input: 's = "pwwkew"',
        expectedOutput: '3'
      }
    ],
    starterTemplates: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Write your solution here
  let maxLength = 0;
  let left = 0;
  const set = new Set();
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Write your solution here
        seen = {}
        left = 0
        max_len = 0
        for right, char in enumerate(s):
            if char in seen and seen[char] >= left:
                left = seen[char] + 1
            seen[char] = right
            max_len = max(max_len, right - left + 1)
        return max_len`,
      java: `import java.util.HashMap;
import java.util.Map;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Write your solution here
        int maxLen = 0, left = 0;
        Map<Character, Integer> map = new HashMap<>();
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c) && map.get(c) >= left) {
                left = map.get(c) + 1;
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your solution here
        unordered_map<char, int> charMap;
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s[right];
            if (charMap.find(c) != charMap.end() && charMap[c] >= left) {
                left = charMap[c] + 1;
            }
            charMap[c] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`,
      c: `#include <string.h>

int lengthOfLongestSubstring(char* s) {
    // Write your solution here
    int lastPos[256];
    for (int i = 0; i < 256; i++) lastPos[i] = -1;
    int maxLen = 0, left = 0;
    int len = strlen(s);
    for (int right = 0; right < len; right++) {
        unsigned char c = (unsigned char)s[right];
        if (lastPos[c] >= left) {
            left = lastPos[c] + 1;
        }
        lastPos[c] = right;
        int currentLen = right - left + 1;
        if (currentLen > maxLen) maxLen = currentLen;
    }
    return maxLen;
}`
    }
  }
];

export default CODING_PROBLEMS;
