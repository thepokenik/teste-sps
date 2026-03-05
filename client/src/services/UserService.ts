import axios, { type AxiosResponse } from "axios";

interface User {
    id: number;
    name: string;
    email: string;
    type: string;
}

interface CreateUserData {
    name: string;
    email: string;
    type: string;
    password: string;
}

interface UpdateUserData {
    name?: string;
    email?: string;
    type?: string;
    password?: string;
}

class UserService {
    private baseUrl = `${import.meta.env.VITE_SERVER_URL}/users`;

    private getHeaders() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
        };
    }

    async list(): Promise<AxiosResponse<User[]>> {
        return axios.get<User[]>(this.baseUrl, { headers: this.getHeaders() });
    }

    async get(id: number): Promise<AxiosResponse<User>> {
        return axios.get<User>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
    }

    async create(data: CreateUserData): Promise<AxiosResponse<User>> {
        return axios.post<User>(this.baseUrl, data, { headers: this.getHeaders() });
    }

    async delete(id: number): Promise<AxiosResponse<void>> {
        return axios.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
    }

    async update(id: number, data: UpdateUserData): Promise<AxiosResponse<User>> {
        return axios.put<User>(`${this.baseUrl}/${id}`, data, { headers: this.getHeaders() });
    }
}

export type { User, CreateUserData, UpdateUserData };
export default UserService;
