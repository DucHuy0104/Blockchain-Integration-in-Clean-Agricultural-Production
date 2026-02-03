// app/orders/index.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../constants/Config';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function OrdersScreen() {
    const router = useRouter();
    const { token } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${API_URL}/orders/my-orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#F59E0B';
            case 'confirmed': return '#3B82F6';
            case 'shipping': return '#8B5CF6';
            case 'delivered': return '#10B981';
            case 'completed': return '#10B981';
            case 'cancelled': return '#EF4444';
            default: return Colors.textLight;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Chờ duyệt';
            case 'confirmed': return 'Đã xác nhận';
            case 'shipping': return 'Đang giao';
            case 'delivered': return 'Đã giao';
            case 'completed': return 'Hoàn tất';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    const renderOrderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.orderCard}
            onPress={() => router.push(`/orders/${item.id}`)}
        >
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {getStatusText(item.status)}
                    </Text>
                </View>
            </View>

            <View style={styles.orderBody}>
                <Text style={styles.productName}>{item.product?.name}</Text>
                <Text style={styles.orderMeta}>
                    Số lượng: {item.quantity} | {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </Text>
            </View>

            <View style={styles.orderFooter}>
                <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
                <Text style={styles.totalPrice}>{Number(item.totalPrice).toLocaleString()}đ</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchOrders(); }} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="receipt-outline" size={80} color={Colors.border} />
                        <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
                        <TouchableOpacity
                            style={styles.shopBtn}
                            onPress={() => router.push('/(tabs)')}
                        >
                            <Text style={styles.shopBtnText}>Mua sắm ngay</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: Spacing.md,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    orderId: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.text,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    orderBody: {
        marginBottom: Spacing.sm,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 2,
    },
    orderMeta: {
        fontSize: 13,
        color: Colors.textLight,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.sm,
    },
    totalLabel: {
        fontSize: 14,
        color: Colors.textLight,
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 18,
        color: Colors.textLight,
        marginVertical: Spacing.xl,
    },
    shopBtn: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderRadius: 12,
    },
    shopBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
