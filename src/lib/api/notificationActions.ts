import { NotificationBE, NotificationFE } from "@/types/notification";
import Cookies from "js-cookie";

const BASE = process.env.NEXT_PUBLIC_API_GATEWAY_URL;

const getAuthHeaders = (): HeadersInit => {
    const token = Cookies.get('access_token');

    if (token) {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    return {
        'Content-Type' : 'application/json'
    };
};

const generateLinkFromNotification = (notification: NotificationBE): string => {
    return '/#';
}

const mapDtoToFE = (dto: NotificationBE): NotificationFE => ({
    id: dto.id,
    type: dto.type,
    title: dto.title,
    message: dto.message,
    read: dto.isRead,
    createdAt: dto.createdAt,
    link: generateLinkFromNotification(dto),
});

export const fetchNotifications = async (): Promise<NotificationFE[]> => {
    const response = await fetch(`${BASE}/api/v1/notifications/users/me`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Не удалось загрузить уведомления');

    const data: NotificationBE[] = await response.json();
    return data.map(mapDtoToFE);
}

export const markNotificationAsRead = async (id: string): Promise<NotificationFE> => {
  const response = await fetch(`/api/v1/notifications/${id}/read`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Не удалось отметить уведомление как прочитанное');
  }
  
  const data: NotificationBE = await response.json();
  return mapDtoToFE(data);
};