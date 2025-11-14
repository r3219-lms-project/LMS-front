import type { Group, GroupStatus } from '@/types/group';

interface GroupListProps {
    groups: Group[];
    onEdit: (group: Group) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: GroupStatus) => void;
}

const statusColors = {
    CREATED: 'bg-gray-700 text-gray-200',
    IN_PROGRESS: 'bg-blue-900 text-blue-200',
    IN_ARCHIVE: 'bg-yellow-900 text-yellow-200',
};

const statusLabels = {
    CREATED: 'Создана',
    IN_PROGRESS: 'В процессе',
    IN_ARCHIVE: 'В архиве',
};

export function GroupList({ groups, onEdit, onDelete, onStatusChange }: GroupListProps) {
    if (groups.length === 0) {
        return (
            <div className="bg-gray-800 rounded-lg shadow-md p-12 text-center border border-gray-700">
                <p className="text-gray-400 text-lg">Группы не найдены</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {groups.map((group) => (
                <div key={group.id} className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2 text-white">{group.name}</h3>
                            {group.description && (
                                <p className="text-gray-400 mb-3">{group.description}</p>
                            )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[group.status]}`}>
                            {statusLabels[group.status]}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                            <span className="text-gray-400">Студентов:</span>
                            <span className="ml-2 font-medium text-gray-200">{group.students.length}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">Длительность:</span>
                            <span className="ml-2 font-medium text-gray-200">{group.duration} ч</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onEdit(group)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition"
                        >
                            Редактировать
                        </button>
                        <button
                            onClick={() => onDelete(group.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition"
                        >
                            Удалить
                        </button>
                        <select
                            value={group.status}
                            onChange={(e) => onStatusChange(group.id, e.target.value as GroupStatus)}
                            className="bg-gray-700 border border-gray-600 text-gray-200 rounded px-3 py-2 text-sm"
                        >
                            <option value="CREATED">Создана</option>
                            <option value="IN_PROGRESS">В процессе</option>
                            <option value="IN_ARCHIVE">В архиве</option>
                        </select>
                    </div>
                </div>
            ))}
        </div>
    );
}
