'use server';

import { cookies } from "next/headers";

import type { LoginForm, RegisterForm } from "@/types/auth";

type AuthResponse = {
    accessToken: string,
    refreshToken: string;
}

type ActionResult = {
    ok: boolean,
    error?: string;
}

const BASE = process.env.NEXT_PUBLIC_AUTH_API;

export const login = async (form: LoginForm) => {
    try {
        const response = await fetch(`${BASE}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        const data = await response.json();

        if(!response.ok) {
            console.error('Login failed');
            return {
                ok: false,
                error: data.message || 'Не удалось войти в аккаунт'
            }
        }

        const { accessToken, refreshToken } = data as AuthResponse;

        (await cookies()).set('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            path: '/',
            sameSite: 'lax'
        });
        
        (await cookies()).set('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production",
            path: '/',
            sameSite: "lax"
        });

        return {ok: true};
    } catch(err: any) {
        console.error("An unexpected error occured: " + err);
        return {
            ok: false,
            error: "Произошла непредвиденная ошибка"
        };
    }
}

export const register = async (form: RegisterForm): Promise<ActionResult> => {
    try {
        const response = await fetch(`${BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Registration failed:', data.message);
            return { ok: false, error: data.message || 'Регистрация не удалась' };
        }

        const { accessToken, refreshToken } = data as AuthResponse;
        if(accessToken && refreshToken) {
            (await cookies()).set('access_token', accessToken, { httpOnly: true, secure: true, path: '/', sameSite: 'lax' });
            (await cookies()).set('refresh_token', refreshToken, { httpOnly: true, secure: true, path: '/', sameSite: 'lax' });
        }


        return { ok: true };
    } catch (err: any) {
        console.error('An unexpected error occurred:', err);
        return { ok: false, error: 'Произошла непредвиденная ошибка' };
    }
}

export const logout = async () => {
    const refreshToken = (await cookies()).get('refresh_token');

    if(refreshToken) {
        try {
            const response = await fetch(`${BASE}/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ oldRefreshToken: refreshToken })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to revoke old refresh roken', errorData.message);
            } else {
                console.log('Old refresh token revoked successfully');
            }
        } catch(err: any) {
            console.error("Could not reach backend to revoke token: ", err);
        }
    }

    (await cookies()).delete('access_token');
    (await cookies()).delete('refresh_token');

    window.location.href = '/auth/login'
}

// TODO /logout-all