// src/app/components/Notifications/Notifications.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import Link from 'next/link';
import { NotificationFE } from '@/types/notification';
import { fetchNotifications, markNotificationAsRead } from '@/lib/api/notificationActions';

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationFE[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchNotifications();
        data.sort((a, b) => Number(a.read) - Number(b.read) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setNotifications(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Произошла неизвестная ошибка");
      } finally {
        setIsLoading(false);
      }
    };
    loadNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    const previousState = [...notifications];
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );

    try {
      await markNotificationAsRead(id);
    } catch (error) {
      console.error("Ошибка при отметке 'прочитано':", error);
      setNotifications(previousState);
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        aria-label={`Уведомления, ${unreadCount} непрочитанных`}
        className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <FaBell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-96 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 p-3">
            <h3 className="text-base font-semibold text-gray-800">Уведомления</h3>
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="py-8 text-center text-sm text-gray-500">Загрузка...</div>
            ) : error ? (
              <div className="py-8 text-center text-sm text-red-600">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">Нет новых уведомлений</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map(notification => (
                  <li 
                    key={notification.id}
                    className={`flex items-stretch transition-colors duration-150 ${notification.read ? '' : 'bg-blue-50'} hover:bg-gray-100`}
                  >
                    <Link href={notification.link} className="flex-grow p-3" onClick={() => setIsOpen(false)}>
                      <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <time className="mt-1.5 block text-xs text-gray-500" dateTime={notification.createdAt}>
                        {new Date(notification.createdAt).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      </time>
                    </Link>

                    {!notification.read && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id); }}
                        title="Отметить как прочитанное"
                        aria-label="Отметить как прочитанное"
                        className="group flex flex-shrink-0 items-center justify-center px-4"
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500 transition-transform duration-200 group-hover:scale-110" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}