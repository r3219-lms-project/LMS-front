'use client';

import { useEffect, useState } from 'react';
import { getCourseProgressStats } from '@/lib/api/progressApi';
import type { CourseProgressStats } from '@/types/progress';

interface CourseProgressPanelProps {
    courseId: string;
}

export function CourseProgressPanel({ courseId }: CourseProgressPanelProps) {
    const [stats, setStats] = useState<CourseProgressStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        
        async function loadStats() {
            try {
                setLoading(true);
                const data = await getCourseProgressStats(courseId);
                if (!cancelled) {
                    setStats(data);
                }
            } catch (err) {
                // Игнорируем ошибки - просто не показываем прогресс
                if (!cancelled) {
                    console.error('Failed to load progress stats:', err);
                    setStats(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        
        loadStats().catch((err) => {
            if (!cancelled) {
                console.error('Unhandled error in loadStats:', err);
                setStats(null);
                setLoading(false);
            }
        });
        
        return () => {
            cancelled = true;
        };
    }, [courseId]);

    if (loading) {
        return null;
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="rounded-lg border p-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-3">Прогресс курса</h3>
            <div className="space-y-3">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Завершено уроков</span>
                        <span className="font-medium">
                            {stats.completedLessons} / {stats.totalLessons}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all"
                            style={{ width: `${stats.completionPercentage}%` }}
                        ></div>
                    </div>
                </div>
                <div className="text-center">
                    <span className="text-2xl font-bold text-blue-600">
                        {stats.completionPercentage.toFixed(0)}%
                    </span>
                </div>
            </div>
        </div>
    );
}

