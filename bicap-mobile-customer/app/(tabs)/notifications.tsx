import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, FlatList,
    ActivityIndicator, RefreshControl, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../constants/Config';
import { Colors, Spacing, Typography } from '../../constants/theme';

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${API_URL}/public/notifications`);
            setNotifications(response.data.notifications || []);
        } catch (error: any) {
            console.error('Lỗi tải thông báo:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.notificationItem}>
            <View style={[styles.iconContainer, { backgroundColor: item.type === 'PLATFORM' ? '#E0E7FF' : '#DCFCE7' }]}>
                <Ionicons
                    name={item.type === 'PLATFORM' ? 'megaphone-outline' : 'leaf-outline'}
                    size={24}
                    color={item.type === 'PLATFORM' ? '#4338CA' : '#15803D'}
                />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.content}</Text>
                <Text style={styles.time}>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="notifications-off-outline" size={60} color={Colors.border} />
                            <Text style={styles.emptyText}>Chưa có thông báo nào.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    list: { padding: Spacing.md },
    notificationItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: Spacing.md,
        borderRadius: 12,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    content: { flex: 1 },
    title: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
    description: { fontSize: 14, color: Colors.textLight, marginBottom: 8 },
    time: { fontSize: 12, color: Colors.textLight },

    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { marginTop: 16, color: Colors.textLight, fontSize: 16 },
});
