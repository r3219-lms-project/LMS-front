import type {
    LessonProgress,
    CourseProgress,
    UserProgress,
    CourseProgressStats,
} from '@/types/progress';

const API_BASE_URL = process.env.NEXT_PUBLIC_PROGRESS_API || 'http://localhost:8088';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function safeFetch(url: string, options?: RequestInit): Promise<Response> {
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            throw new Error(`API ${res.status} ${res.statusText}`);
        }
        return res;
    } catch (error) {
        // Преобразуем сетевые ошибки в обычные Error, чтобы они перехватывались try-catch
        if (error instanceof TypeError) {
            throw new Error('Network error');
        }
        throw error;
    }
}

/** POST /progress/lessons/{lessonId}/complete */
export async function completeLesson(lessonId: string): Promise<LessonProgress> {
    const res = await safeFetch(`${API_BASE_URL}/progress/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers: JSON_HEADERS,
        credentials: 'include',
        cache: 'no-store',
    });
    return res.json();
}

/** GET /progress/courses/{courseId} */
export async function getCourseProgress(courseId: string): Promise<CourseProgress> {
    const res = await safeFetch(`${API_BASE_URL}/progress/courses/${courseId}`, {
        credentials: 'include',
        cache: 'no-store',
    });
    return res.json();
}

/** GET /progress/users/me */
export async function getUserProgress(): Promise<UserProgress> {
    const res = await safeFetch(`${API_BASE_URL}/progress/users/me`, {
        credentials: 'include',
        cache: 'no-store',
    });
    return res.json();
}

/** GET /progress/courses/{courseId}/stats */
export async function getCourseProgressStats(courseId: string): Promise<CourseProgressStats> {
    const res = await safeFetch(`${API_BASE_URL}/progress/courses/${courseId}/stats`, {
        credentials: 'include',
        cache: 'no-store',
    });
    return res.json();
}

