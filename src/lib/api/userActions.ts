'use server';

import { cookies } from "next/headers";
import { User } from "@/types/user";

const BASE = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

type ActionResult<T> = {
    ok: boolean,
    data?: T,
    error?: string;
} 

const getAccessToken = async (): Promise<string | undefined> => {
    return (await cookies()).get('access_token')?.value;
} 

export const getUserByEmail = async (email: string): Promise<ActionResult<User>> => {
    const accessToken = await getAccessToken();

    if(!accessToken) return {ok: false, error: "Необходимо войти в аккаунт!"};

    try {
        const response = await fetch(`${BASE}api/v1/users/by-email?email=${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authoriztion': `Bearer ${accessToken}`
            }
        });

        if(!response.ok) {
            const errorData = await response.json();
            return {ok: false, error: errorData.message || 'Не удалось получить данные пользователя'};
        }

        const data: User = await response.json();
        return {ok: true, data};
    } catch (err: any) {
        console.error("Error while getting user data", err);
        return {ok: false, error: "Произошла непредвиденная ошибка"};
    }
}

export const getUserById = async (id: string): Promise<ActionResult<User>> => {
    const accessToken = await getAccessToken();

    if (!accessToken) return {ok: false, error: "Необходимо войти в аккаунт!"};

    try {
        const response = await fetch(`${BASE}/api/v1/users/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": 'application/json',
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {ok: false, error: errorData.message || 'Не удалось получить данные пользователя'};
        }

        const data: User = await response.json();
        return {ok: true, data};
    } catch(err: any) {
        console.error("Error while getting user by id", err);
        return {ok: false, error: "Произошла непредвиденная ошибка"};
    }
}