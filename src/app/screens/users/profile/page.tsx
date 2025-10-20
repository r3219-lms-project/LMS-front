import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { User } from '@/types/user';
import { getUserById } from '@/lib/api/userActions';
import LogoutButton from '@/app/components/LogoutButton';

const ProfilePage = async () => {
    const token = (await cookies()).get('access_token')?.value;

    if (!token) {
        redirect('/auth/login');
    }

    let user: User | null = null;
    let error: string | null = null;

    try {
        const decodedToken: { sub: string } = jwtDecode(token);
        const userId: string = decodedToken.sub;

        const response = await getUserById(userId);

        if (response.ok && response.data) {
            user = response.data;
        } else {
            error = response.error || "Не удалось получить данные профиля";
        }
    } catch (err) {
        console.error(err);
        error = 'Произошла ошибка при обработке вашего токена. Попробуйте войти снова.';
    }


    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    if (!user) {
        return <div className="flex justify-center items-center h-screen">Загрузка данных...</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-lg">
            <div className="bg-white dark:bg-zinc-800 shadow-md rounded-lg p-6">
                
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">
                        Профиль пользователя
                    </h1>
                    <LogoutButton />
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Имя</label>
                    <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{user.firstName}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Фамилия</label>
                    <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{user.lastName}</p>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Электронная почта</label>
                    <p className="mt-1 text-lg text-gray-900 dark:text-gray-100">{user.email}</p>
                </div>

            </div>
        </div>
    );
}

export default ProfilePage;