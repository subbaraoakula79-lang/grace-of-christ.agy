import axios from 'axios';

let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
if (API_URL && !API_URL.endsWith('/api') && !API_URL.endsWith('/api/')) {
  API_URL = `${API_URL.replace(/\/+$/, '')}/api`;
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('goc_access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const res = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        const { accessToken } = res.data;
        localStorage.setItem('goc_access_token', accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('goc_access_token');
        localStorage.removeItem('goc_user');
        if (typeof window !== 'undefined') window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Typed API helpers ─────────────────────────────────────────────────────────

export const authAPI = {
  login: (email: string, password: string, totpToken?: string) =>
    api.post('/auth/login', { email, password, totpToken }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updateProfile: (data: Record<string, unknown>) => api.put('/auth/profile', data),
  setupTOTP: () => api.post('/auth/totp/setup'),
  verifyTOTP: (token: string) => api.post('/auth/totp/verify', { token }),
};

export const donationsAPI = {
  createOrder: (amount: number) => api.post('/donations/order', { amount }),
  submit: (data: Record<string, unknown>) => api.post('/donations', data),
  getReceipt: (receiptId: string) => api.get(`/donations/receipt/${receiptId}`),
  list: (params?: Record<string, unknown>) => api.get('/donations', { params }),
  stats: () => api.get('/donations/stats'),
  pdfUrl: (receiptId: string) =>
    `${API_URL}/donations/receipt/${receiptId}/pdf`,
};

export const eventsAPI = {
  list: (params?: Record<string, unknown>) => api.get('/events', { params }),
  get: (id: string) => api.get(`/events/${id}`),
  create: (data: Record<string, unknown>) => api.post('/events', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
};

export const sermonsAPI = {
  list: (params?: Record<string, unknown>) => api.get('/sermons', { params }),
  get: (id: string) => api.get(`/sermons/${id}`),
  create: (data: Record<string, unknown>) => api.post('/sermons', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/sermons/${id}`, data),
  delete: (id: string) => api.delete(`/sermons/${id}`),
};

export const galleryAPI = {
  list: (params?: Record<string, unknown>) => api.get('/gallery', { params }),
  add: (data: Record<string, unknown>) => api.post('/gallery', data),
  delete: (id: string) => api.delete(`/gallery/${id}`),
};

export const uploadAPI = {
  uploadImage: (formData: FormData) =>
    api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const contactAPI = {
  submit: (data: Record<string, unknown>) => api.post('/contact', data),
  list: (params?: Record<string, unknown>) => api.get('/contact', { params }),
  markRead: (id: string) => api.patch(`/contact/${id}/read`),
  delete: (id: string) => api.delete(`/contact/${id}`),
};

export const reportsAPI = {
  summary: () => api.get('/reports/summary'),
  csvUrl: (params?: { from?: string; to?: string }) => {
    const search = params ? `?${new URLSearchParams(params as Record<string, string>)}` : '';
    return `${API_URL}/reports/donations/csv${search}`;
  },
};
