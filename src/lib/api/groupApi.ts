import type {
    Group,
    CreateGroupRequest,
    CreateGroupResponse,
    UpdateGroupRequest,
    ChangeGroupStatusRequest,
} from '@/types/group';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function fetchWithErrorHandling(url: string, options?: RequestInit) {
    try {
        const response = await fetch(url, {
            ...options,
            mode: 'cors',
            credentials: 'omit',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }

        return response;
    } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new Error('Не удалось подключиться к серверу. Проверьте, что сервер запущен на ' + API_BASE_URL);
        }
        throw error;
    }
}

export const groupApi = {
    async getAllGroups(): Promise<Group[]> {
        const response = await fetchWithErrorHandling(`${API_BASE_URL}/api/groups`);
        return response.json();
    },

    async getGroupById(id: string): Promise<Group> {
        const response = await fetchWithErrorHandling(`${API_BASE_URL}/api/groups/${id}`);
        return response.json();
    },

    async createGroup(data: CreateGroupRequest): Promise<CreateGroupResponse> {
        const response = await fetchWithErrorHandling(`${API_BASE_URL}/api/groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    async updateGroup(id: string, data: UpdateGroupRequest): Promise<Group> {
        const response = await fetchWithErrorHandling(`${API_BASE_URL}/api/groups/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    },

    async deleteGroup(id: string): Promise<void> {
        await fetchWithErrorHandling(`${API_BASE_URL}/api/groups/${id}`, {
            method: 'DELETE',
        });
    },

    async changeStatus(id: string, data: ChangeGroupStatusRequest): Promise<Group> {
        const response = await fetchWithErrorHandling(`${API_BASE_URL}/api/groups/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return response.json();
    },
};
