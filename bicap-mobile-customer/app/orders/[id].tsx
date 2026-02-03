// app/orders/[id].tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../constants/Config';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { token } = useAuth();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    const fetchOrderDetail = async () => {
        try {
            const response = await axios.get(`${API_URL}/orders/my-orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const detail = response.data.orders.find((o: any) => o.id.toString() === id);
            setOrder(detail);
        } catch (error) {
            console.error('Error fetching order detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        Alert.alert(
            'Hủy đơn hàng',
            'Bạn có chắc chắn muốn hủy đơn hàng này?',
            [
                { text: 'Không', style: 'cancel' },
                {
                    text: 'Hủy đơn',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await axios.put(`${API_URL}/orders/${id}/cancel`, {}, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            Alert.alert('Thành công', 'Đơn hàng đã được hủy');
                            fetchOrderDetail();
                        } catch (error: any) {
                            Alert.alert('Lỗi', error.response?.data?.message || 'Không thể hủy đơn hàng');
                        }
                    }
                }
            ]
        );
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

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.centerContainer}>
                <Text>Không tìm thấy đơn hàng</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                {/* Status Section */}
                <View style={styles.statusSection}>
                    <Text style={styles.statusLabel}>Trạng thái đơn hàng</Text>
                    <Text style={styles.statusValue}>{getStatusText(order.status)}</Text>
                    <Text style={styles.orderDate}>Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}</Text>
                </View>

                {/* Product Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin sản phẩm</Text>
                    <View style={styles.card}>
                        <View style={styles.productRow}>
                            <View style={styles.productInfo}>
                                <Text style={styles.productName}>{order.product?.name}</Text>
                                <Text style={styles.farmName}>Trang trại: {order.product?.farm?.name}</Text>
                                <Text style={styles.priceInfo}>
                                    {Number(order.product?.price).toLocaleString()}đ x {order.quantity}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Tổng cộng</Text>
                            <Text style={styles.totalPrice}>{Number(order.totalPrice).toLocaleString()}đ</Text>
                        </View>
                    </View>
                </View>

                {/* Blockchain Info (If confirmed/completed) */}
                {order.blockchainTxHash && (
                    <View style={styles.blockchainCard}>
                        <View style={styles.blockchainHeader}>
                            <MaterialCommunityIcons name="shield-check" size={24} color="#065F46" />
                            <Text style={styles.blockchainTitle}>Xác thực Blockchain</Text>
                        </View>
                        <Text style={styles.txHash} numberOfLines={2}>TxHash: {order.blockchainTxHash}</Text>
                    </View>
                )}

                {/* Actions */}
                {order.status === 'pending' && (
                    <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelOrder}>
                        <Text style={styles.cancelBtnText}>Hủy đơn hàng</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
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
    content: {
        flex: 1,
        padding: Spacing.md,
    },
    statusSection: {
        backgroundColor: Colors.primary,
        padding: Spacing.xl,
        borderRadius: 12,
        marginBottom: Spacing.md,
    },
    statusLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 4,
    },
    statusValue: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    orderDate: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    productRow: {
        flexDirection: 'row',
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    farmName: {
        fontSize: 14,
        color: Colors.textLight,
        marginBottom: 4,
    },
    priceInfo: {
        fontSize: 15,
        color: Colors.primary,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: Spacing.md,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 16,
        color: Colors.text,
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    blockchainCard: {
        backgroundColor: '#ECFDF5',
        padding: Spacing.md,
        borderRadius: 12,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    blockchainHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    blockchainTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#065F46',
        marginLeft: 8,
    },
    txHash: {
        fontSize: 12,
        color: '#047857',
        fontFamily: 'monospace',
    },
    cancelBtn: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.error,
        padding: Spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: Spacing.md,
        marginBottom: Spacing.xl,
    },
    cancelBtnText: {
        color: Colors.error,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
