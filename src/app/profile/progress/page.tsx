'use client';

import { useEffect, useState } from 'react';
import { getUserProgress } from '@/lib/api/progressApi';
import type { UserProgress } from '@/types/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ProgressPage() {
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        
        async function loadProgress() {
            try {
                setLoading(true);
                setError(null);
                const data = await getUserProgress();
                if (!cancelled) {
                    setProgress(data);
                }
            } catch (err) {
                // Игнорируем ошибки - показываем пустое состояние
                if (!cancelled) {
                    console.error('Failed to load progress:', err);
                    setProgress(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        
        loadProgress().catch((err) => {
            // Дополнительная обработка для предотвращения необработанных промисов
            if (!cancelled) {
                console.error('Unhandled error in loadProgress:', err);
                setProgress(null);
                setLoading(false);
            }
        });
        
        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500 text-lg">Загрузка прогресса...</p>
            </div>
        );
    }

    if (!loading && !progress) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Мой прогресс обучения</h1>
                    </header>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <p className="text-gray-500">Данные прогресса недоступны</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!progress) {
        return null;
    }

    // Данные для круговой диаграммы общего прогресса
    const overallProgressData = [
        { name: 'Завершено', value: progress.totalCompletedLessons },
        { name: 'Осталось', value: progress.totalLessons - progress.totalCompletedLessons },
    ];

    // Данные для столбчатой диаграммы по курсам
    const courseProgressData = progress.courses.map((course) => ({
        name: `Курс ${course.courseId}`,
        completion: course.completionPercentage,
        completed: course.lessons.filter((l) => l.completed).length,
        total: course.lessons.length,
    }));

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Мой прогресс обучения</h1>
                    <p className="text-gray-600">
                        Общий прогресс: {progress.overallCompletionPercentage.toFixed(1)}%
                    </p>
                </header>

                {/* Общий прогресс - круговая диаграмма */}
                <section className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Общий прогресс</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={overallProgressData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name}: ${(percent * 100).toFixed(0)}%`
                                        }
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {overallProgressData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Всего уроков</p>
                                    <p className="text-2xl font-bold">{progress.totalLessons}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Завершено уроков</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {progress.totalCompletedLessons}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Процент завершения</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {progress.overallCompletionPercentage.toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Прогресс по курсам - столбчатая диаграмма */}
                <section className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Прогресс по курсам</h2>
                    {courseProgressData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={courseProgressData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    formatter={(value: number) => `${value.toFixed(1)}%`}
                                />
                                <Legend />
                                <Bar dataKey="completion" fill="#8884d8" name="Процент завершения" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-500">Нет данных о курсах</p>
                    )}
                </section>

                {/* Детальная информация по курсам */}
                <section className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Детали по курсам</h2>
                    <div className="space-y-4">
                        {progress.courses.length === 0 ? (
                            <p className="text-gray-500">Вы еще не начали изучать курсы</p>
                        ) : (
                            progress.courses.map((course) => (
                                <div
                                    key={course.courseId}
                                    className="border rounded-lg p-4 hover:shadow-md transition"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium">Курс {course.courseId}</h3>
                                        <span className="text-sm font-bold text-blue-600">
                                            {course.completionPercentage.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                            style={{ width: `${course.completionPercentage}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Завершено: {course.lessons.filter((l) => l.completed).length}{' '}
                                        из {course.lessons.length} уроков
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

