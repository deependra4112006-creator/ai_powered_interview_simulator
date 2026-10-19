const API_BASE = '/api';

const getHeaders = (hasAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (hasAuth) {
    const token = localStorage.getItem('interviewai_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // AUTH
  auth: {
    async register(userData) {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify(userData),
      });
      return handleResponse(res);
    },

    async login(credentials) {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify(credentials),
      });
      return handleResponse(res);
    },

    async guestLogin() {
      const res = await fetch(`${API_BASE}/auth/guest-login`, {
        method: 'POST',
        headers: getHeaders(false),
      });
      return handleResponse(res);
    },

    async getMe() {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async updateProfile(profileData) {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(profileData),
      });
      return handleResponse(res);
    },

    async changePassword(passwordData) {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(passwordData),
      });
      return handleResponse(res);
    },

    async deleteAccount() {
      const res = await fetch(`${API_BASE}/auth/delete-account`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },
  },

  // INTERVIEWS
  interviews: {
    async createSession(config) {
      const res = await fetch(`${API_BASE}/interviews/sessions`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(config),
      });
      return handleResponse(res);
    },

    async getSession(id) {
      const res = await fetch(`${API_BASE}/interviews/sessions/${id}`, {
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async submitAnswer(id, answerData) {
      const res = await fetch(`${API_BASE}/interviews/sessions/${id}/submit-answer`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(answerData),
      });
      return handleResponse(res);
    },

    async requestHint(id, questionId) {
      const res = await fetch(`${API_BASE}/interviews/sessions/${id}/hint`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({ questionId }),
      });
      return handleResponse(res);
    },

    async completeSession(id) {
      const res = await fetch(`${API_BASE}/interviews/sessions/${id}/complete`, {
        method: 'POST',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async getUserSessions(params = {}) {
      const query = new URLSearchParams(params).toString();
      const url = `${API_BASE}/interviews/sessions${query ? `?${query}` : ''}`;
      const res = await fetch(url, {
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async deleteSession(id) {
      const res = await fetch(`${API_BASE}/interviews/sessions/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async clearHistory() {
      const res = await fetch(`${API_BASE}/interviews/sessions/clear-history`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async runCode({ code, language, testCases }) {
      const res = await fetch(`${API_BASE}/interviews/run-code`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({ code, language, testCases }),
      });
      return handleResponse(res);
    },
  },

  // ANALYTICS
  analytics: {
    async getUserAnalytics() {
      const res = await fetch(`${API_BASE}/analytics`, {
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },
  },

  // SETTINGS
  settings: {
    async getSystemSettings() {
      const res = await fetch(`${API_BASE}/settings`, {
        headers: getHeaders(false),
      });
      return handleResponse(res);
    },

    async testLLM(apiKey, provider = 'gemini') {
      const res = await fetch(`${API_BASE}/settings/test-llm`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({ apiKey, provider }),
      });
      return handleResponse(res);
    },
  },

  // AI COACH
  coach: {
    async sendMessage(message, history = []) {
      const res = await fetch(`${API_BASE}/coach/chat`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({ message, history }),
      });
      return handleResponse(res);
    },
  },

  // ADMIN
  admin: {
    async getStats() {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async getUsers() {
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async updateUserStatus(id, status) {
      const res = await fetch(`${API_BASE}/admin/users/${id}/status`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify({ status }),
      });
      return handleResponse(res);
    },

    async getQuestions() {
      const res = await fetch(`${API_BASE}/admin/questions`, {
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async createQuestion(questionData) {
      const res = await fetch(`${API_BASE}/admin/questions`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(questionData),
      });
      return handleResponse(res);
    },

    async updateQuestion(id, questionData) {
      const res = await fetch(`${API_BASE}/admin/questions/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(questionData),
      });
      return handleResponse(res);
    },

    async deleteQuestion(id) {
      const res = await fetch(`${API_BASE}/admin/questions/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },
  },
};

export default api;
