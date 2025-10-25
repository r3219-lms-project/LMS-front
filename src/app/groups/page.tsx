'use client';

import { useState, useEffect } from 'react';
import { GroupList } from './components/GroupList';
import { GroupForm } from './components/GroupForm';
import type { Group, GroupFormData, GroupStatus } from '@/types/group';
import { groupApi } from '@/lib/api/groupApi';

export default function GroupsPage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Group | undefined>();

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        try {
            setLoading(true);
            const data = await groupApi.getAllGroups();
            setGroups(data);
            setError(null);
        } catch (err) {
            setError('Ошибка загрузки групп');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (data: GroupFormData) => {
        try {
            await groupApi.createGroup({
                name: data.name,
                description: data.description,
                duration: data.duration,
            });
            await loadGroups();
            setIsFormOpen(false);
        } catch (err) {
            setError('Ошибка создания группы');
            console.error(err);
        }
    };

    const handleUpdate = async (data: GroupFormData) => {
        if (!editingGroup) return;
        try {
            await groupApi.updateGroup(editingGroup.id, {
                name: data.name,
                description: data.description,
                duration: data.duration,
            });
            await loadGroups();
            setEditingGroup(undefined);
            setIsFormOpen(false);
        } catch (err) {
            setError('Ошибка обновления группы');
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Вы уверены, что хотите удалить эту группу?')) return;
        try {
            await groupApi.deleteGroup(id);
            await loadGroups();
        } catch (err) {
            setError('Ошибка удаления группы');
            console.error(err);
        }
    };

    const handleStatusChange = async (id: string, status: GroupStatus) => {
        try {
            await groupApi.changeStatus(id, { status });
            await loadGroups();
        } catch (err) {
            setError('Ошибка изменения статуса');
            console.error(err);
        }
    };

    const handleEdit = (group: Group) => {
        setEditingGroup(group);
        setIsFormOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-gray-400 text-lg">Загрузка...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Управление группами</h1>
                    <button
                        onClick={() => {
                            setEditingGroup(undefined);
                            setIsFormOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium transition"
                    >
                        Создать группу
                    </button>
                </div>

                {error && (
                    <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {isFormOpen && (
                    <div className="mb-8">
                        <GroupForm
                            group={editingGroup}
                            onSubmit={editingGroup ? handleUpdate : handleCreate}
                            onCancel={() => {
                                setIsFormOpen(false);
                                setEditingGroup(undefined);
                            }}
                        />
                    </div>
                )}

                <GroupList
                    groups={groups}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                />
            </div>
        </div>
    );
}
