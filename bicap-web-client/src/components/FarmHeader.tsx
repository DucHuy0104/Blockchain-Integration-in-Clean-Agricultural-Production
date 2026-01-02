'use client';

import Link from 'next/link';
import LogoutButton from './LogoutButton';
import { useNotification } from '@/context/NotificationContext';
import { useState } from 'react';

export default function FarmHeader() {
    const { unreadCount, notifications, markAsRead, clearNotifications } = useNotification();
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <nav className="bg-green-600 text-white p-4 sticky top-0 z-50 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/farm" className="text-xl font-bold">Farm Portal</Link>
                <div className="space-x-4 flex items-center">
                    <Link href="/farm" className="hover:text-green-200">Dashboard</Link>
                    <Link href="/farm/seasons" className="hover:text-green-200">Seasons</Link>
                    <Link href="/farm/products" className="hover:text-green-200">Products</Link>
                    <Link href="/farm/orders" className="hover:text-green-200">Orders</Link>
                    <Link href="/farm/shipments" className="hover:text-green-200">Shipments</Link>
                    <Link href="/farm/reports" className="hover:text-green-200">Reports</Link>
                    <Link href="/farm/monitoring" className="hover:text-green-200">🌡️ Monitoring</Link>
                    <Link href="/farm/services" className="hover:text-green-200">Services</Link>
                    <Link href="/farm/info" className="hover:text-green-200">Farm Info</Link>
                    <Link href="/farm/profile" className="hover:text-green-200">Profile</Link>
                    <Link href="/market" className="hover:text-green-200 font-bold border-l pl-4 ml-4">🏪 Market</Link>

                    {/* Notification Bell */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-1 hover:bg-green-700 rounded-full transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-20 border border-gray-200 dark:border-gray-700 ring-1 ring-black ring-opacity-5">
                                <div className="py-2 px-3 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Thông báo</h3>
                                    {notifications.length > 0 && (
                                        <button onClick={clearNotifications} className="text-xs text-blue-600 hover:text-blue-800">
                                            Xóa tất cả
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="p-4 text-center text-sm text-gray-500">
                                            Không có thông báo mới.
                                        </div>
                                    ) : (
                                        notifications.map(notif => (
                                            <div
                                                key={notif.id}
                                                className={`p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                                onClick={() => markAsRead(notif.id)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <p className={`text-sm font-medium ${notif.type === 'error' || notif.type === 'warning' ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>
                                                        {notif.title}
                                                    </p>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                    {notif.message}
                                                </p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <LogoutButton />
                </div>
            </div>
        </nav>
    );
}
