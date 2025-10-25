export type GroupStatus = 'CREATED' | 'IN_PROGRESS' | 'IN_ARCHIVE';

export interface Group {
    id: string;
    name: string;
    description?: string;
    duration: number;
    status: GroupStatus;
    students: string[];
}

export interface GroupFormData {
    name: string;
    description?: string;
    duration: number;
    students: string[];
}

export interface CreateGroupRequest {
    name: string;
    description?: string;
    duration: number;
}

export interface UpdateGroupRequest {
    name: string;
    description?: string;
    duration: number;
}

export interface ChangeGroupStatusRequest {
    status: GroupStatus;
}
