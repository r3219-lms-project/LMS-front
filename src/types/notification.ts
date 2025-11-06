export interface NotificationBE {
    id: string,
    type: string,
    title: string,
    message: string,
    isRead: boolean,
    createdAt: string
};

export interface NotificationFE extends Omit<NotificationBE, 'isRead'>{
    read: boolean,
    link: string
};