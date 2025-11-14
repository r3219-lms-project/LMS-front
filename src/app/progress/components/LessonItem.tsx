'use client';

import { useState } from 'react';
import { completeLesson } from '@/lib/api/progressApi';
import type { LessonProgress } from '@/types/progress';

interface Lesson {
    id: string;
    title: string;
    description?: string;
}

interface LessonItemProps {
    lesson: Lesson;
    courseId: string;
    progress?: LessonProgress;
    onProgressUpdate?: () => void;
}

export function LessonItem({ lesson, courseId, progress, onProgressUpdate }: LessonItemProps) {
    const [completing, setCompleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isCompleted = progress?.completed || false;

    const handleComplete = async () => {
        if (isCompleted) {
            return;
        }

        try {
            setCompleting(true);
            setError(null);
            await completeLesson(lesson.id);
            if (onProgressUpdate) {
                onProgressUpdate();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка отметки урока');
            console.error('Failed to complete lesson:', err);
        } finally {
            setCompleting(false);
        }
    };

    return (
        <div
            className={`rounded-lg border p-4 ${
                isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
            }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        {isCompleted ? (
                            <svg
                                className="w-5 h-5 text-green-600"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                        )}
                        <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                    </div>
                    {lesson.description && (
                        <p className="text-sm text-gray-600 ml-7">{lesson.description}</p>
                    )}
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                </div>
                {!isCompleted && (
                    <button
                        onClick={handleComplete}
                        disabled={completing}
                        className="ml-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {completing ? 'Отмечаем...' : 'Отметить как завершенный'}
                    </button>
                )}
            </div>
        </div>
    );
}

