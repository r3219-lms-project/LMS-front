import StatCard from '@/app/components/StatCard';
import AdminChart from '@/app/components/AdminChart';
import RecentRegistrations from '@/app/components/RecentRegistrations';

type User = {
  id: number;
  name: string;
  email: string;
  date: string;
};

interface StatsData {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  activeUsers: number;
  lastRegistrations: User[];
}

async function getStats(): Promise<StatsData> {
  const res = await fetch('http://localhost:3000/api/admin/stats', {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Не удалось загрузить статистику');
  }
  return res.json();
}

const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const CoursesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg>;
const EnrollmentsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const ActiveUsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export default async function AdminPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Панель администратора</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Всего пользователей" value={stats.totalUsers} icon={<UsersIcon />} />
        <StatCard title="Всего курсов" value={stats.totalCourses} icon={<CoursesIcon />} />
        <StatCard title="Всего записей" value={stats.totalEnrollments} icon={<EnrollmentsIcon />} />
        <StatCard title="Активные за 7 дней" value={stats.activeUsers} icon={<ActiveUsersIcon />} />
      </div>

      <AdminChart data={stats} />

      <RecentRegistrations users={stats.lastRegistrations} />
    </div>
  );
}