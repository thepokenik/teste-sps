import api from "@/services/api";

interface LoginResponse {
    user: {
        id: number;
        name: string;
        email: string;
        type: string;
        imageUrl?: string;
    };
    token: string;
}

class AuthService {
    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>("/login", {
            email,
            password,
        });
        return response.data;
    }
}

export type { LoginResponse };
export default AuthService;
