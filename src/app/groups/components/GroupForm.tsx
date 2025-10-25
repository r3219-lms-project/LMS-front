import { useState, useEffect } from 'react';
import type { Group, GroupFormData } from '@/types/group';

interface GroupFormProps {
    group?: Group;
    onSubmit: (data: GroupFormData) => void;
    onCancel: () => void;
}

export function GroupForm({ group, onSubmit, onCancel }: GroupFormProps) {
    const [formData, setFormData] = useState<GroupFormData>({
        name: '',
        description: '',
        duration: 0,
        students: [],
    });

    useEffect(() => {
        if (group) {
            setFormData({
                name: group.name,
                description: group.description || '',
                duration: group.duration,
                students: group.students,
            });
        }
    }, [group]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-white">
                {group ? 'Редактировать группу' : 'Создать группу'}
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Название *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Введите название группы"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Описание
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Введите описание"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Длительность (часы) *
                    </label>
                    <input
                        type="number"
                        required
                        min="1"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Введите длительность"
                    />
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition"
                >
                    {group ? 'Сохранить' : 'Создать'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-6 py-2 rounded font-medium transition"
                >
                    Отмена
                </button>
            </div>
        </form>
    );
}
