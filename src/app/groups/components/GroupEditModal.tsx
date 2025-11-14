import { useState } from 'react';
import { groupApi } from '@/lib/api/groupApi';
import type { Group, UpdateGroupRequest, GroupStatus } from '@/types/group';

interface GroupEditModalProps {
    group: Group;
    onClose: () => void;
    onSuccess: () => void;
}

export function GroupEditModal({ group, onClose, onSuccess }: GroupEditModalProps) {
    const [formData, setFormData] = useState<UpdateGroupRequest>({
        name: group.name,
        description: group.description || '',
        students: [...group.students],
        duration: group.duration,
        status: group.status,
    });
    const [studentInput, setStudentInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await groupApi.updateGroup(group.id, formData);
            onSuccess();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Ошибка обновления группы');
        } finally {
            setLoading(false);
        }
    };

    const addStudent = () => {
        if (studentInput.trim() && !formData.students?.includes(studentInput.trim())) {
            setFormData({
                ...formData,
                students: [...(formData.students || []), studentInput.trim()],
            });
            setStudentInput('');
        }
    };

    const removeStudent = (student: string) => {
        setFormData({
            ...formData,
            students: formData.students?.filter((s) => s !== student) || [],
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Редактировать группу</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Название *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Описание</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Длительность (часы) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Статус</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as GroupStatus })}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            >
                                <option value="CREATED">Создана</option>
                                <option value="IN_PROGRESS">В процессе</option>
                                <option value="IN_ARCHIVE">В архиве</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Студенты</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={studentInput}
                                    onChange={(e) => setStudentInput(e.target.value)}
                                    placeholder="ID студента"
                                    className="flex-1 border border-gray-300 rounded px-3 py-2"
                                />
                                <button
                                    type="button"
                                    onClick={addStudent}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                                >
                                    Добавить
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.students?.map((student) => (
                                    <span
                                        key={student}
                                        className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                                    >
                                        {student}
                                        <button
                                            type="button"
                                            onClick={() => removeStudent(student)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded transition"
                            >
                                {loading ? 'Сохранение...' : 'Сохранить'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded transition"
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
