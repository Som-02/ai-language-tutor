import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Attach JWT token to every request automatically
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser   = (data)         => API.post('/api/auth/register', data);
export const loginUser      = (data)         => API.post('/api/auth/login', data);
export const sendMessage    = (data)         => API.post('/api/chat', data);
export const getSessions    = ()             => API.get('/api/sessions');
export const getSession     = (id)           => API.get(`/api/sessions/${id}`);
export const getFlashcards  = ()             => API.get('/api/flashcards');
export const reviewFlashcard= (id)           => API.patch(`/api/flashcards/${id}/review`);
export const deleteFlashcard= (id)           => API.delete(`/api/flashcards/${id}`);
export const getProgress    = ()             => API.get('/api/progress');