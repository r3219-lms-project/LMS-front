'use client';

import { logout } from "@/lib/authActions";

const LogoutButton = () => {
    return (
        <button 
            onClick={logout}
            className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
            Выйти
        </button>
    );
}

export default LogoutButton;