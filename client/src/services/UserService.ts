import api from "@/services/api";
import type { AxiosResponse } from "axios";

interface User {
    id: number;
    name: string;
    email: string;
    type: string;
    imageUrl?: string;
}

interface CreateUserData {
    name: string;
    email: string;
    type: string;
    password: string;
    imageUrl?: File | string;
}

interface UpdateUserData {
    name?: string;
    email?: string;
    type?: string;
    password?: string;
    imageUrl?: File | string;
}

class UserService {
    private baseUrl = "/users";

    async list(): Promise<AxiosResponse<User[]>> {
        return api.get<User[]>(this.baseUrl);
    }

    async get(id: number): Promise<AxiosResponse<User>> {
        return api.get<User>(`${this.baseUrl}/${id}`);
    }

    async create(data: CreateUserData): Promise<AxiosResponse<User>> {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value as Blob | string);
            }
        });
        return api.post<User>(this.baseUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }

    async delete(id: number): Promise<AxiosResponse<void>> {
        return api.delete(`${this.baseUrl}/${id}`);
    }

    async update(id: number, data: UpdateUserData): Promise<AxiosResponse<User>> {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value as Blob | string);
            }
        });
        return api.put<User>(`${this.baseUrl}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }
}

export type { User, CreateUserData, UpdateUserData };
export default UserService;