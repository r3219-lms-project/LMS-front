'use server';

import { cookies } from "next/headers";
import { User } from "@/types/user";

const BASE = process.env.NEXT_PUBLIC_USER_API;

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
        const response = await fetch(`${BASE}/by-email?email=${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add authorization after service refactoring
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
        const response = await fetch(`${BASE}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": 'application/json'
                // Need to add authorization
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