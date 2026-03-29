import axios from 'axios';

// Axios instance — Authorization header is injected globally by AuthContext
const api = axios.create({
  baseURL: 'https://calendly-assign.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

// ✅ ADD THIS BLOCK
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("calendly_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login:    (email: string, password: string) =>
              api.post('/auth/login',    { email, password }),
  register: (name: string, email: string, password: string, timezone?: string) =>
              api.post('/auth/register', { name, email, password, timezone }),
  me:       () => api.get('/auth/me'),
};

// ─── Event Types ─────────────────────────────────────────────────────────────
export const eventTypesApi = {
  getAll:    ()             => api.get('/event-types'),
  getById:   (id: number)   => api.get(`/event-types/${id}`),
  getBySlug: (slug: string) => api.get(`/event-types/slug/${slug}`),
  create:    (data: unknown) => api.post('/event-types', data),
  update:    (id: number, data: unknown) => api.put(`/event-types/${id}`, data),
  delete:    (id: number)   => api.delete(`/event-types/${id}`),
};

// ─── Availability ─────────────────────────────────────────────────────────────
export const availabilityApi = {
  get:      () => api.get('/availability'),
  update:   (data: unknown) => api.put('/availability', data),
  getSlots: (eventTypeId: number, date: string) =>
              api.get('/availability/slots', { params: { eventTypeId, date } }),
};

// ─── Booking ──────────────────────────────────────────────────────────────────
export const bookingApi = {
  create: (data: unknown) => api.post('/book', data),
};

// ─── Meetings ─────────────────────────────────────────────────────────────────
export const meetingsApi = {
  getAll:  (type: 'upcoming' | 'past') => api.get('/meetings', { params: { type } }),
  getById: (id: number) => api.get(`/meetings/${id}`),
  cancel:  (id: number, cancel_reason?: string) =>
             api.patch(`/meetings/${id}/cancel`, { cancel_reason }),
};

// ─── Users ────────────────────────────────────────────────────────────────────
export const usersApi = {
  getMe:    () => api.get('/users/me'),
  updateMe: (data: unknown) => api.put('/users/me', data),
};

export default api;
