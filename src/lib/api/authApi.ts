import type { RegisterForm } from "@/types/auth";

type ApiError = { message: string; code?: string };
const BASE = process.env.NEXT_PUBLIC_AUTH_API;

const jsonFetch = async <T, >(url: string, init?: RequestInit): Promise<T> => {
    const res = await fetch(url, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers || {}),
        },
        credentials: "include",
    });

    let data: unknown = null
    try {
        data = await res.json();
    } catch {}

    if(!res.ok) {
        const err = (data as ApiError) || { message: "Request failed"};
        throw Object.assign(new Error(err.message), {status: res.status, code: err.code});
    }

    return data as T;
};

export const register = async (form: RegisterForm): Promise<{ok: true; userId?: string}> => {
    return jsonFetch<{ok: true}>(`${BASE}/register`, {
        method: "POST",
        body: JSON.stringify(form)
    });
}