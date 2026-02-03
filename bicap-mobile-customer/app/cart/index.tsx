// app/cart/index.tsx
import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useCart } from '../../contexts/CartContext';

export default function CartScreen() {
    const router = useRouter();
    const { cartItems, updateQuantity, removeFromCart, totalAmount, itemCount } = useCart();

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.cartItem}>
            <Image
                source={{ uri: item.image?.startsWith('http') ? item.image : `http://192.168.1.16:5001${item.image}` }}
                style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.farmName}>{item.farmName}</Text>
                <Text style={styles.itemPrice}>{Number(item.price).toLocaleString()}đ / {item.unit}</Text>

                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={styles.quantityBtn}
                        onPress={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                        <Ionicons name="remove" size={18} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityBtn}
                        onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                        <Ionicons name="add" size={18} color={Colors.text} />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeFromCart(item.productId)}
            >
                <Ionicons name="trash-outline" size={24} color={Colors.error} />
            </TouchableOpacity>
        </View>
    );

    if (cartItems.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="cart-off" size={80} color={Colors.border} />
                <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
                <TouchableOpacity
                    style={styles.shopBtn}
                    onPress={() => router.push('/(tabs)')}
                >
                    <Text style={styles.shopBtnText}>Mua sắm ngay</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={item => item.productId.toString()}
                contentContainerStyle={styles.listContent}
            />

            <View style={styles.footer}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tổng số lượng:</Text>
                    <Text style={styles.summaryValue}>{itemCount} sản phẩm</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tổng thanh toán:</Text>
                    <Text style={styles.totalPrice}>{totalAmount.toLocaleString()}đ</Text>
                </View>

                <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={() => router.push('/checkout')}
                >
                    <Text style={styles.checkoutBtnText}>Xác nhận đặt hàng</Text>
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
    listContent: {
        padding: Spacing.md,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
    },
    itemInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 2,
    },
    farmName: {
        fontSize: 12,
        color: Colors.textLight,
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.primary,
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    quantityBtn: {
        padding: 4,
        paddingHorizontal: 8,
    },
    quantityText: {
        fontSize: 14,
        fontWeight: 'bold',
        paddingHorizontal: 8,
    },
    removeBtn: {
        padding: Spacing.sm,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    emptyText: {
        fontSize: 18,
        color: Colors.textLight,
        marginTop: Spacing.md,
        marginBottom: Spacing.xl,
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
        fontSize: 16,
    },
    footer: {
        backgroundColor: '#fff',
        padding: Spacing.lg,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    summaryLabel: {
        fontSize: 16,
        color: Colors.textLight,
    },
    summaryValue: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: '600',
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    checkoutBtn: {
        backgroundColor: Colors.primary,
        padding: Spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    checkoutBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
