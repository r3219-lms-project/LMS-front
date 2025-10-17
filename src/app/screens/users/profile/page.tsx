'use client';

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { getUserById } from "@/lib/api/userActions";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

const ProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);

            const token = Cookies.get('access_token');
            if (!token) {
                setError('Вы не вошли в аккаунт');
                setLoading(false);
                window.location.href = "/auth/login";
                return;
            }

            try {
                const decodedToken: {sub: string} = jwtDecode(token);
                const userId: string = decodedToken.sub;

                const response = await getUserById(userId);

                if (response.ok && response.data) {
                    setUser(response.data);
                } else {
                    setError(response.error || "Не удалось получить данные с профиля");
                }
            } catch (err: any) {
                setError('Произошла ошибка при загрузке данных');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();

    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Загрузка...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Профиль пользователя</h1>
            {user && (
                <div className="bg-white dark:bg-zinc-800 shadow-md rounded-lg p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Имя</label>
                        <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{user.firstName}</p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Фамилия</label>
                        <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{user.lastName}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Электронная почта</label>
                        <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{user.email}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;
