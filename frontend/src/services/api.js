import axios from 'axios';

const RAW_API_URL = import.meta.env.VITE_API_URL || '/api';
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401s
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          const newAccess = res.data.access;
          localStorage.setItem('access_token', newAccess);
          api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      let userObj = response.data.user;
      if (!userObj) {
        try {
          const profileRes = await api.get('/auth/profile/');
          userObj = profileRes.data;
        } catch (err) {
          userObj = { username: credentials.username };
        }
      }
      
      localStorage.setItem('user', JSON.stringify(userObj));
      return { tokens: response.data, user: userObj };
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    if (response.data.tokens) {
      localStorage.setItem('access_token', response.data.tokens.access);
      localStorage.setItem('refresh_token', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },
  updateProfileDetails: (formData) => api.patch('/auth/profile/update/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  changePassword: (data) => api.post('/auth/change-password/', data),
};

export const userService = {
  getDashboardSummary: () => api.get('/user/dashboard-summary/'),
};

export const notificationService = {
  getNotifications: () => api.get('/notifications/'),
  getUnreadCount: () => api.get('/notifications/unread_count/'),
  markAsRead: (id) => api.post(`/notifications/${id}/read/`),
  markAllRead: () => api.post('/notifications/mark_all_read/'),
};

export const badgeService = {
  getBadges: () => api.get('/badges/'),
};

export const challengeService = {
  getChallenges: () => api.get('/daily-challenges/'),
  completeChallenge: (id) => api.post(`/daily-challenges/${id}/complete/`),
};

export const communityService = {
  getStories: (params) => api.get('/stories/', { params }),
  likeStory: (id) => api.post(`/stories/${id}/like/`),
  createStory: (formData) => api.post('/stories/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const aiService = {
  askAssistant: (prompt) => api.post('/ai-assistant/chat/', { prompt }),
};

export const overviewService = {
  getOverview: () => api.get('/public/overview/'),
};

export const pledgeService = {
  getPledges: () => api.get('/pledges/'),
  createPledge: (data) => api.post('/pledges/', data),
  getMyPledges: () => api.get('/pledges/my-pledges/'),
};

export const wasteReportService = {
  getReports: (params) => api.get('/waste-reports/', { params }),
  createReport: (formData) => api.post('/waste-reports/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getMyReports: () => api.get('/waste-reports/my-reports/'),
  updateStatus: (id, data) => api.patch(`/waste-reports/${id}/status/`, data),
};

export const eventService = {
  getEvents: (params) => api.get('/cleanup-events/', { params }),
  getEvent: (id) => api.get(`/cleanup-events/${id}/`),
  createEvent: (data) => api.post('/cleanup-events/', data),
  volunteer: (eventId, volunteerData) => api.post(`/cleanup-events/${eventId}/volunteer/`, volunteerData),
  getMyVolunteering: () => api.get('/cleanup-events/my-volunteering/'),
};

export const campaignService = {
  getCampaigns: (params) => api.get('/campaigns/', { params }),
  createCampaign: (data) => api.post('/campaigns/', data),
};

export const ecoService = {
  getActivities: () => api.get('/eco-activities/'),
  logActivity: (data) => api.post('/eco-activities/', data),
  getLeaderboard: () => api.get('/eco-activities/leaderboard/'),
};

export const contactService = {
  sendMessage: (data) => api.post('/contact/', data),
  getMessages: () => api.get('/contact/'),
};

export const adminService = {
  getAnalytics: () => api.get('/admin/analytics/'),
  exportCSV: (type = 'reports') => api.get(`/admin/export-csv/?type=${type}`, { responseType: 'blob' }),
};

export default api;
