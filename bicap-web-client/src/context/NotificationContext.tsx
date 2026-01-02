'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
    markAsRead: (id: number) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Mock initial notifications for demo
    useEffect(() => {
        const mockNotifications: Notification[] = [
            {
                id: 1,
                title: 'Cảnh báo nhiệt độ',
                message: 'Khu vực A: Nhiệt độ vượt ngưỡng 35°C',
                type: 'warning',
                read: false,
                createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 mins ago
            },
            {
                id: 2,
                title: 'Đơn hàng mới',
                message: 'Nhà bán lẻ CoopMart đã đặt hàng 500kg Cà chua.',
                type: 'success',
                read: false,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
            },
            {
                id: 3,
                title: 'Vận chuyển cập nhật',
                message: 'Đơn hàng #102 đã được giao thành công.',
                type: 'info',
                read: true,
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
            }
        ];
        setNotifications(mockNotifications);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now(),
            read: false,
            createdAt: new Date().toISOString()
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
