// app/checkout/index.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../constants/Config';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export default function CheckoutScreen() {
    const router = useRouter();
    const { user, token } = useAuth();
    const { cartItems, totalAmount, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [note, setNote] = useState('');

    const handlePlaceOrder = async () => {
        if (!user || !token) return;

        setLoading(true);
        try {
            // Process orders one by one (Backend currently takes one product per order)
            // In a real app, this should be a batch transaction or the backend should support multiple items
            for (const item of cartItems) {
                await axios.post(
                    `${API_URL}/orders`,
                    {
                        productId: item.productId,
                        quantity: item.quantity,
                        contractTerms: note || `Đơn hàng đặt vào ngày ${new Date().toLocaleDateString('vi-VN')}`
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
            }

            Alert.alert(
                'Thành công',
                'Đơn hàng của bạn đã được tiếp nhận!',
                [
                    {
                        text: 'Xem đơn hàng',
                        onPress: () => {
                            clearCart();
                            router.replace('/orders');
                        }
                    },
                    {
                        text: 'Về trang chủ',
                        onPress: () => {
                            clearCart();
                            router.replace('/(tabs)');
                        }
                    }
                ]
            );
        } catch (error: any) {
            console.error('Checkout error:', error);
            Alert.alert('Lỗi', error.response?.data?.message || 'Không thể đặt hàng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                {/* Shipping Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
                    <View style={styles.card}>
                        <View style={styles.infoRow}>
                            <Ionicons name="person-outline" size={20} color={Colors.textLight} />
                            <Text style={styles.infoText}>{user?.fullName}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="call-outline" size={20} color={Colors.textLight} />
                            <Text style={styles.infoText}>{user?.phone || 'Chưa cập nhật số điện thoại'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={20} color={Colors.textLight} />
                            <Text style={styles.infoText}>{user?.address || 'Chưa cập nhật địa chỉ'}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.editBtn}
                            onPress={() => router.push('/profile/edit-profile')}
                        >
                            <Text style={styles.editBtnText}>Thay đổi thông tin</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Order Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
                    <View style={styles.card}>
                        {cartItems.map(item => (
                            <View key={item.productId} style={styles.orderItem}>
                                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                <Text style={styles.itemQty}>x{item.quantity}</Text>
                                <Text style={styles.itemPrice}>{(item.price * item.quantity).toLocaleString()}đ</Text>
                            </View>
                        ))}
                        <View style={styles.divider} />
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Tổng cộng</Text>
                            <Text style={styles.totalValue}>{totalAmount.toLocaleString()}đ</Text>
                        </View>
                    </View>
                </View>

                {/* Notes */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ghi chú đơn hàng</Text>
                    <TextInput
                        style={styles.noteInput}
                        placeholder="Yêu cầu đặc biệt cho trang trại (ví dụ: giao vào buổi sáng...)"
                        multiline
                        numberOfLines={4}
                        value={note}
                        onChangeText={setNote}
                    />
                </View>

                {/* Payment Method */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                    <View style={styles.card}>
                        <View style={styles.paymentMethod}>
                            <MaterialCommunityIcons name="cash" size={24} color={Colors.primary} />
                            <Text style={styles.paymentText}>Thanh toán khi nhận hàng (COD)</Text>
                            <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.placeOrderBtn, loading && styles.disabledBtn]}
                    onPress={handlePlaceOrder}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.placeOrderText}>Đặt hàng ngay</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        padding: Spacing.md,
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
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
        gap: 8,
    },
    infoText: {
        fontSize: 15,
        color: Colors.text,
    },
    editBtn: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.sm,
        marginTop: Spacing.sm,
        alignItems: 'center',
    },
    editBtnText: {
        color: Colors.primary,
        fontWeight: '600',
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    itemName: {
        flex: 1,
        fontSize: 15,
        color: Colors.text,
    },
    itemQty: {
        fontSize: 14,
        color: Colors.textLight,
        marginHorizontal: Spacing.md,
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: Spacing.sm,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    noteInput: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        fontSize: 15,
        textAlignVertical: 'top',
        height: 100,
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    paymentText: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
    },
    footer: {
        backgroundColor: '#fff',
        padding: Spacing.lg,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    placeOrderBtn: {
        backgroundColor: Colors.primary,
        padding: Spacing.md,
        borderRadius: 12,
        alignItems: 'center',
    },
    placeOrderText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    disabledBtn: {
        opacity: 0.7,
    },
});
