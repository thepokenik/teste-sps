import api from "@/services/api";
import type { AxiosResponse } from "axios";

interface AttachFile {
    name: string;
    url: string;
}

interface Attach {
    id?: number;
    user_id: number;
    files?: any[]; // To allow both File[] from UI or AttachFile[] from server
}

class AttachService {
    private baseUrl = "/attachs";

    async list(userId?: number): Promise<AxiosResponse<Attach[]>> {
        const url = userId ? `${this.baseUrl}?user_id=${userId}` : this.baseUrl;
        return api.get<Attach[]>(url);
    }

    async get(id: number): Promise<AxiosResponse<Attach>> {
        return api.get<Attach>(`${this.baseUrl}/${id}`);
    }

    async create(data: FormData): Promise<AxiosResponse<Attach>> {
        return api.post<Attach>(this.baseUrl, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }

    async delete(id: number): Promise<AxiosResponse<void>> {
        return api.delete(`${this.baseUrl}/${id}`);
    }

    async update(id: number, data: Attach): Promise<AxiosResponse<Attach>> {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value as Blob | string);
            }
        });
        return api.put<Attach>(`${this.baseUrl}/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }
}

export type { Attach, AttachFile };
export default AttachService;