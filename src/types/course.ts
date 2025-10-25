export type CourseStatus = 'CREATED' | 'IN_PROGRESS' | 'IN_ARCHIVE';

export interface Course {
    id: string;
    name: string;
    description?: string | null;
    students: string[];
    duration: number;
    status: CourseStatus;
}

/**
 * Not provided explicitly in the backend snippet, but inferred from the model.
 * Adjust if your actual CreateCourseRequest differs.
 */
export interface CreateCourseRequest {
    name: string;
    description?: string;
    students?: string[];
    duration: number;
    status?: CourseStatus; // optional: backend defaults to CREATED
}

export interface CreateCourseResponse {
    id: string;
    name: string;
    description?: string | null;
    students: string[];
    duration: number;
    status: CourseStatus;
}

export interface UpdateCourseRequest {
    name: string;
    description?: string;
    students?: string[];
    duration: number;
    // In Java, field is courseStatus with getter/setter named getStatus/setStatus.
    // Most Jackson configs serialize by getter => JSON key "status".
    status?: CourseStatus;
}

export interface ChangeStatusRequest {
    status: CourseStatus;
}
