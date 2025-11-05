"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartData {
    totalUsers: number;
    totalCourses: number;
    totalEnrollments: number;
    activeUsers: number;
}

const AdminChart = ({ data }: { data: ChartData }) => {
  const chartData = [
    { name: 'Пользователи', Всего: data.totalUsers, Активные: data.activeUsers },
    { name: 'Курсы', Всего: data.totalCourses },
    { name: 'Записи', Всего: data.totalEnrollments },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Общая статистика</h3>
      <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
              <YAxis tick={{ fill: '#6B7280' }} />
              <Tooltip
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid #e5e7eb',
                }}
              />
              <Legend />
              <Bar dataKey="Всего" fill="#3B82F6" name="Всего" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Активные" fill="#8B5CF6" name="Активные" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminChart;