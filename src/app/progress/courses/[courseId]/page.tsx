'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getCourse } from '@/lib/api/courseApi';
import { getCourseProgress } from '@/lib/api/progressApi';
import { CourseProgressPanel } from '../../components/CourseProgressPanel';
import { LessonItem } from '../../components/LessonItem';
import type { Course } from '@/types/course';
import type { CourseProgress, LessonProgress } from '@/types/progress';

// Моковые данные уроков - в реальном приложении это должно приходить из API курсов
// Предполагаем, что курс имеет уроки. В реальности нужно добавить API для получения уроков курса
const getMockLessons = (courseId: string) => {
    // Это временное решение - в реальном приложении нужно получать уроки из API
    return [
        { id: `${courseId}-lesson-1`, title: 'Введение в курс', description: 'Основные понятия' },
        { id: `${courseId}-lesson-2`, title: 'Урок 2', description: 'Продолжение обучения' },
        { id: `${courseId}-lesson-3`, title: 'Урок 3', description: 'Практические задания' },
        { id: `${courseId}-lesson-4`, title: 'Урок 4', description: 'Заключительный урок' },
    ];
};

export default function CourseProgressPage() {
    const params = useParams();
    const courseId = params.courseId as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [progress, setProgress] = useState<CourseProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCourseData = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            }
            setError(null);

            const courseData = await getCourse(courseId);
            setCourse(courseData);
            
            // Пытаемся загрузить прогресс, но игнорируем ошибки
            try {
                const progressData = await getCourseProgress(courseId);
                setProgress(progressData);
            } catch (err) {
                console.error('Failed to load progress:', err);
                setProgress(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка загрузки курса');
            console.error('Failed to load course:', err);
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    }, [courseId]);

    useEffect(() => {
        if (!courseId) return;
        
        let cancelled = false;
        
        loadCourseData()
            .catch((err) => {
                if (!cancelled) {
                    console.error('Unhandled error in loadCourseData:', err);
                    setError('Ошибка загрузки данных');
                    setLoading(false);
                }
            });
        
        return () => {
            cancelled = true;
        };
    }, [courseId, loadCourseData]);

    const handleProgressUpdate = useCallback(() => {
        // Обновляем только прогресс, без показа loading
        loadCourseData(false).catch((err) => {
            console.error('Failed to update progress:', err);
        });
    }, [loadCourseData]);

    const getProgressForLesson = (lessonId: string): LessonProgress | undefined => {
        return progress?.lessons.find((l: LessonProgress) => l.lessonId === lessonId);
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-6xl p-6">
                <p className="text-gray-500">Загрузка...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-6xl p-6">
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
                    {error}
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="mx-auto max-w-6xl p-6">
                <p className="text-gray-500">Курс не найден</p>
            </div>
        );
    }

    const lessons = getMockLessons(courseId);

    return (
        <div className="mx-auto max-w-6xl p-6 space-y-6">
            <header>
                <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
                {course.description && (
                    <p className="text-gray-600 mb-4">{course.description}</p>
                )}
                <div className="flex gap-4 text-sm text-gray-500">
                    <span>Длительность: {course.duration} ч</span>
                    <span>Статус: {course.status}</span>
                </div>
            </header>

            <CourseProgressPanel courseId={courseId} />

            <section>
                <h2 className="text-2xl font-semibold mb-4">Уроки курса</h2>
                <div className="space-y-3">
                    {lessons.map((lesson) => (
                        <LessonItem
                            key={lesson.id}
                            lesson={lesson}
                            courseId={courseId}
                            progress={getProgressForLesson(lesson.id)}
                            onProgressUpdate={handleProgressUpdate}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

