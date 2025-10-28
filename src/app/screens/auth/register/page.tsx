'use client';

import { useState } from "react";
import type { RegisterForm } from '@/types/auth';
import { register } from "@/lib/authActions";
import Link from "next/link";

const RegisterPage = () => {
    const [form, setForm] = useState<RegisterForm>({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });

    const [ok, setOk] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: value}));
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setOk(false);
        setLoading(true);

        try {
            const response = await register(form);

            if (response.ok) {
                setOk(true);
                setForm({firstName: "", lastName: "", email: "", password: ""})
                console.log("Registration was successfull");
                window.location.href = '/users/profile';
            }

        } catch(err: any) {
            const errorMessage = err.message || "Регистрация не удалась";
            setError(errorMessage);
            console.error("Registration failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-lg rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <h1 className="text-xl font-semibold mb-4">Регистрация</h1>

                {ok && (
                    <div className="mb-4 rounded-md bg-green-100 text-green-800 px-3 py-3 text-sm">
                        Регистрация вошла успешна! Войдите в аккаунт по вашим данным.
                    </div>
                )}

                {error && (
                    <div className="mb-4 rounded-md bg-red-100 text-red-800 px-3 py-2 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm mb-1">Имя</label>
                        
                        <input 
                            id="firstName"
                            name="firstName"
                            type="text"
                            autoComplete="given-name"
                            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-400"
                            value={form.firstName}
                            onChange={handleChange}
                            placeholder="Введите имя"
                            required
                        />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm mb-1">Фамилия</label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            autoComplete="family-name"
                            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-400"
                            value={form.lastName}
                            onChange={handleChange}
                            placeholder="Введите фамилию"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm mb-1">Эл.почта</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-400"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Введите адрес эл. почты"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm mb-1">Пароль</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-400"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Введите пароль"
                            minLength={8}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-zinc-900 text-white py-2 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
                    >
                        {loading ? "Регистрируем вас..." : "Регистрация"}
                    </button>
                </form>

                <div className="pt-5">
                    <Link href="/auth/login">У вас уже есть аккаунт? Нажмите чтобы войти</Link>
                </div>
            </div>
        </div>
    )

}

export default RegisterPage;