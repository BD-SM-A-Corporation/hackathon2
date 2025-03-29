import api from '../config/api';

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/login', data);
    return response.data;
  },
}; 