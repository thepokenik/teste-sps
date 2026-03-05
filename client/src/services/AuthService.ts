import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER_URL;

interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    type: string;
  };
  token: string;
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  }
}

export type { LoginResponse };
export default AuthService;
