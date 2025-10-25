'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    getAllCourses,
    createCourse,
    deleteCourse,
    changeCourseStatus,
    updateCourse,
} from '@/lib/api/courseApi';
import type { Course, CourseStatus, UpdateCourseRequest } from '@/types/course';

type CreateFormState = {
    name: string;
    description: string;
    duration: string; // keep as string for input
    studentsCsv: string; // comma separated
};

const STATUS_OPTIONS: CourseStatus[] = ['CREATED', 'IN_PROGRESS', 'IN_ARCHIVE'];

function parseStudents(csv: string): string[] {
    return csv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    const [form, setForm] = useState<CreateFormState>({
        name: '',
        description: '',
        duration: '',
        studentsCsv: '',
    });
    const [creating, setCreating] = useState(false);

    // Inline editing state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [edit, setEdit] = useState<{
        name: string;
        description: string;
        duration: string;
        studentsCsv: string;
    }>({ name: '', description: '', duration: '', studentsCsv: '' });

    const hasCourses = useMemo(() => courses.length > 0, [courses]);

    async function load() {
        setLoading(true);
        setErr(null);
        try {
            const data = await getAllCourses();
            setCourses(data);
        } catch (e: unknown) {
            if (e instanceof Error) {
                setErr(e.message);
            } else {
                setErr('Failed to load courses');
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function onCreate(e: React.FormEvent) {
        e.preventDefault();
        const durationNum = Number(form.duration);
        if (!form.name.trim() || !Number.isFinite(durationNum)) {
            alert('Name and numeric duration are required.');
            return;
        }
        setCreating(true);
        try {
            await createCourse({
                name: form.name.trim(),
                description: form.description.trim() || undefined,
                duration: durationNum,
                students: parseStudents(form.studentsCsv),
            });
            setForm({ name: '', description: '', duration: '', studentsCsv: '' });
            await load();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Create failed');
        } finally {
            setCreating(false);
        }
    }

    async function onDelete(id: string) {
        if (!confirm('Delete this course?')) return;
        try {
            await deleteCourse(id);
            setCourses((prev) => prev.filter((c) => c.id !== id));
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Delete failed');
        }
    }

    async function onChangeStatus(id: string, status: CourseStatus) {
        try {
            const updated = await changeCourseStatus(id, status);
            setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Status change failed');
        }
    }

    function startEdit(c: Course) {
        setEditingId(c.id);
        setEdit({
            name: c.name,
            description: c.description ?? '',
            duration: String(c.duration ?? ''),
            studentsCsv: c.students?.join(', ') ?? '',
        });
    }

    function cancelEdit() {
        setEditingId(null);
    }

    async function saveEdit(id: string) {
        const durationNum = Number(edit.duration);
        if (!edit.name.trim() || !Number.isFinite(durationNum)) {
            alert('Name and numeric duration are required.');
            return;
        }
        const payload: UpdateCourseRequest = {
            name: edit.name.trim(),
            description: edit.description.trim() || undefined,
            duration: durationNum,
            students: parseStudents(edit.studentsCsv),
            // status handled via PATCH
        };
        try {
            const updated = await updateCourse(id, payload);
            setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
            setEditingId(null);
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Update failed');
        }
    }


    return (
        <div className="mx-auto max-w-6xl p-6 space-y-8">
        <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Courses</h1>
            <button
    className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-60"
    onClick={load}
    disabled={loading}
    title="Refresh"
        >
          ⟳ Refresh
    </button>
    </header>

    {/* Create form */}
    <section className="rounded-lg border p-4">
    <h2 className="mb-3 text-lg font-medium">Create a new course</h2>
    <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-2">
    <div>
        <label className="mb-1 block text-sm font-medium">Name *</label>
        <input
    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
    value={form.name}
    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
    placeholder="e.g., Intro to Java"
    required
    />
    </div>

    <div>
    <label className="mb-1 block text-sm font-medium">Duration (hours) *</label>
        <input
    type="number"
    min={0}
    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
    value={form.duration}
    onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
    placeholder="e.g., 40"
    required
    />
    </div>

    <div className="sm:col-span-2">
    <label className="mb-1 block text-sm font-medium">Description</label>
        <input
    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
    value={form.description}
    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
    placeholder="Optional description"
        />
        </div>

        <div className="sm:col-span-2">
    <label className="mb-1 block text-sm font-medium">Students (comma separated)</label>
    <input
    className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
    value={form.studentsCsv}
    onChange={(e) => setForm((f) => ({ ...f, studentsCsv: e.target.value }))}
    placeholder="alice,bob,charlie"
        />
        </div>

        <div className="sm:col-span-2">
    <button
        className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90 disabled:opacity-60"
    type="submit"
    disabled={creating}
        >
        {creating ? 'Creating…' : 'Create'}
        </button>
        </div>
        </form>
        </section>

    {/* List */}
    <section className="rounded-lg border p-4">
    <h2 className="mb-3 text-lg font-medium">All courses</h2>

    {loading && <p className="text-sm text-gray-500">Loading…</p>}
        {err && <p className="text-sm text-red-600">{err}</p>}
            {!loading && !hasCourses && <p className="text-sm text-gray-500">No courses yet.</p>}

                {hasCourses && (
                    <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                    <thead>
                        <tr className="border-b bg-gray-50 text-xs uppercase text-gray-600">
                    <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Description</th>
                    <th className="px-3 py-2">Duration</th>
                    <th className="px-3 py-2">Students</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {courses.map((c) => {
                            const editing = editingId === c.id;
                            return (
                                <tr key={c.id} className="border-b last:border-none">
                            <td className="px-3 py-2 align-top">
                                {editing ? (
                                            <input
                                                className="w-full rounded-md border px-2 py-1"
                                        value={edit.name}
                                    onChange={(e) => setEdit((s) => ({ ...s, name: e.target.value }))}
                            />
                        ) : (
                                <span className="font-medium">{c.name}</span>
                            )}
                            </td>

                            <td className="px-3 py-2 align-top">
                                {editing ? (
                                            <input
                                                className="w-full rounded-md border px-2 py-1"
                                        value={edit.description}
                                    onChange={(e) =>
                            setEdit((s) => ({ ...s, description: e.target.value }))
                        }
                            />
                        ) : (
                                <span className="text-gray-700">{c.description ?? '—'}</span>
                            )}
                            </td>

                            <td className="px-3 py-2 align-top">
                                {editing ? (
                                            <input
                                                type="number"
                                        min={0}
                                    className="w-28 rounded-md border px-2 py-1"
                                    value={edit.duration}
                                    onChange={(e) => setEdit((s) => ({ ...s, duration: e.target.value }))}
                            />
                        ) : (
                                <span>{c.duration} h</span>
                        )}
                            </td>

                            <td className="px-3 py-2 align-top">
                                {editing ? (
                                            <input
                                                className="w-full rounded-md border px-2 py-1"
                                        value={edit.studentsCsv}
                                    onChange={(e) =>
                            setEdit((s) => ({ ...s, studentsCsv: e.target.value }))
                        }
                            placeholder="alice,bob"
                                />
                        ) : (
                                <div className="max-w-xs truncate" title={(c.students ?? []).join(', ')}>
                            {c.students?.length ? `${c.students.length} student(s)` : '—'}
                            </div>
                        )}
                            </td>

                            <td className="px-3 py-2 align-top">
                            <div className="flex items-center gap-2">
                            <span className="inline-flex rounded-full border px-2 py-0.5 text-xs">
                                {c.status}
                                </span>
                                <select
                            className="rounded-md border px-2 py-1 text-xs"
                            value={c.status}
                            onChange={(e) => onChangeStatus(c.id, e.target.value as CourseStatus)}
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                {s}
                                </option>
                            ))}
                            </select>
                            </div>
                            </td>

                            <td className="px-3 py-2 align-top">
                            <div className="flex flex-wrap gap-2">
                                {!editing ? (
                                    <>
                                        <button
                                            className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
                                onClick={() => startEdit(c)}
                        >
                            Edit
                            </button>
                            <button
                            className="rounded-md border px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                            onClick={() => onDelete(c.id)}
                        >
                            Delete
                            </button>
                            </>
                        ) : (
                                <>
                                    <button
                                        className="rounded-md bg-black px-2 py-1 text-xs text-white hover:opacity-90"
                            onClick={() => saveEdit(c.id)}
                        >
                            Save
                            </button>
                            <button
                            className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
                            onClick={cancelEdit}
                                >
                                Cancel
                                </button>
                                </>
                        )}
                            </div>
                            </td>
                            </tr>
                        );
                        })}
                    </tbody>
                    </table>
                    </div>
                )}
                </section>
                </div>
            );
            }
