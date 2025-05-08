export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  role: 'customer' | 'admin';
  avatar?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}