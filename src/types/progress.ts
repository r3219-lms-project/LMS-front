export interface LessonProgress {
    id: string;
    userId: string;
    lessonId: string;
    courseId: string;
    completed: boolean;
    completedAt?: string | null;
    lastAccessedAt?: string | null;
}

export interface CourseProgress {
    courseId: string;
    lessons: LessonProgress[];
    completionPercentage: number;
}

export interface UserProgress {
    courses: CourseProgress[];
    totalCompletedLessons: number;
    totalLessons: number;
    overallCompletionPercentage: number;
}

export interface CourseProgressStats {
    courseId: string;
    completionPercentage: number;
    totalLessons: number;
    completedLessons: number;
}

