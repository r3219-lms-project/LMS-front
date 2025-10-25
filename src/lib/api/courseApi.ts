import type {
    Course,
    CreateCourseRequest,
    CreateCourseResponse,
    UpdateCourseRequest,
    ChangeStatusRequest,
} from '@/types/course';

const BASE = process.env.NEXT_PUBLIC_COURSES_API!;
const JSON_HEADERS = { 'Content-Type': 'application/json' };

function ok(res: Response) {
    if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);
    return res;
}

/** GET /api/v1/courses */
export async function getAllCourses(): Promise<Course[]> {
    const res = await fetch(`${BASE}/api/v1/courses`, { cache: 'no-store' });
    return ok(res).json();
}

/** GET /api/v1/courses/{id} -> CreateCourseResponse (aligned to Course shape) */
export async function getCourse(id: string): Promise<CreateCourseResponse> {
    const res = await fetch(`${BASE}/api/v1/courses/${id}`, { cache: 'no-store' });
    return ok(res).json();
}

/** POST /api/v1/courses */
export async function createCourse(
    payload: CreateCourseRequest
): Promise<CreateCourseResponse> {
    const res = await fetch(`${BASE}/api/v1/courses`, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(payload),
    });
    return ok(res).json();
}

/** DELETE /api/v1/courses/{id} */
export async function deleteCourse(id: string): Promise<void> {
    const res = await fetch(`${BASE}/api/v1/courses/${id}`, { method: 'DELETE' });
    ok(res);
}

/** PATCH /api/v1/courses/{id}/status { status } */
export async function changeCourseStatus(
    id: string,
    status: ChangeStatusRequest['status']
): Promise<Course> {
    const res = await fetch(`${BASE}/api/v1/courses/${id}/status`, {
        method: 'PATCH',
        headers: JSON_HEADERS,
        body: JSON.stringify({ status }),
    });
    return ok(res).json();
}

/** PUT /api/v1/courses/{id} */
export async function updateCourse(id: string, payload: UpdateCourseRequest): Promise<Course> {
    const res = await fetch(`${BASE}/api/v1/courses/${id}`, {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify(payload),
    });
    return ok(res).json();
}
