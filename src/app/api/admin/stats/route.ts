import { NextResponse } from "next/server";

export const GET = async () => {
    // TODO get stats of all users, courses, enrollments. After that we need to get stats from backend
    const stats = {
        totalUsers: 100,
        totalCourses: 80,
        totalEnrollments: 50,
        activeUsers: 20, // Who logined last 7 days
        lastRegistrations: [
            { id: 1, name: 'Елена Иванова', email: 'elena.ivanova@example.com', date: '2025-11-05' },
            { id: 2, name: 'Иван Петров', email: 'ivan.petrov@example.com', date: '2025-11-05' },
            { id: 3, name: 'Анна Смирнова', email: 'anna.smirnova@example.com', date: '2025-11-05' },
            { id: 4, name: 'Дмитрий Кузнецов', email: 'dmitry.kuznetsov@example.com', date: '2025-11-04' },
            { id: 5, name: 'Ольга Васильева', email: 'olga.vasilyeva@example.com', date: '2025-11-04' },
            { id: 6, name: 'Сергей Соколов', email: 'sergey.sokolov@example.com', date: '2025-11-03' },
            { id: 7, name: 'Мария Михайлова', email: 'maria.mikhailova@example.com', date: '2025-11-03' },
            { id: 8, name: 'Алексей Новиков', email: 'alexey.novikov@example.com', date: '2025-11-02' },
            { id: 9, name: 'Татьяна Фёдорова', email: 'tatyana.fedorova@example.com', date: '2025-11-02' },
            { id: 10, name: 'Павел Морозов', email: 'pavel.morozov@example.com', date: '2025-11-01' }
        ]
    };

    return NextResponse.json(stats);
}