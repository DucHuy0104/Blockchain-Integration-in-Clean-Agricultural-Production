import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, Image, ScrollView, TouchableOpacity,
    ActivityIndicator, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../constants/Config';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export default function ProductDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProductDetail();
    }, [id]);

    const fetchProductDetail = async () => {
        try {
            const response = await axios.get(`${API_URL}/public/products/${id}`);
            setProduct(response.data.product);
        } catch (error: any) {
            console.error('Error fetching product:', error);
            Alert.alert('Lỗi', 'Không thể tải thông tin sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            Alert.alert(
                'Yêu cầu đăng nhập',
                'Bạn cần đăng nhập để mua hàng',
                [
                    { text: 'Hủy', style: 'cancel' },
                    { text: 'Đăng nhập', onPress: () => router.push('/auth/login') }
                ]
            );
            return;
        }
        addToCart(product, quantity);
        Alert.alert('Thành công', `Đã thêm ${quantity} ${product.name} vào giỏ hàng`);
    };

    const handleBuyNow = () => {
        if (!user) {
            Alert.alert(
                'Yêu cầu đăng nhập',
                'Bạn cần đăng nhập để mua hàng',
                [
                    { text: 'Hủy', style: 'cancel' },
                    { text: 'Đăng nhập', onPress: () => router.push('/auth/login') }
                ]
            );
            return;
        }
        addToCart(product, quantity);
        router.push('/checkout');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.errorContainer}>
                <Text>Không tìm thấy sản phẩm</Text>
            </View>
        );
    }

    const imageUrl = product.image
        ? product.image.startsWith('http')
            ? product.image
            : `http://192.168.1.16:5001${product.image}`
        : 'https://via.placeholder.com/400?text=No+Image';

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Image source={{ uri: imageUrl }} style={styles.productImage} />
                </View>

                {/* Product Info */}
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.certBadge}>
                            <MaterialCommunityIcons name="certificate" size={16} color="#046c4e" />
                            <Text style={styles.certText}>{product.certification || 'VietGAP'}</Text>
                        </View>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.price}>{Number(product.price || 0).toLocaleString()}đ / {product.unit || 'kg'}</Text>
                    </View>

                    {/* Farm Info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông tin trang trại</Text>
                        <View style={styles.farmCard}>
                            <MaterialCommunityIcons name="barn" size={24} color={Colors.primary} />
                            <View style={styles.farmInfo}>
                                <Text style={styles.farmName}>{product.farm?.name || 'Vườn nhà'}</Text>
                                <Text style={styles.farmLocation}>
                                    <Ionicons name="location-outline" size={14} color={Colors.textLight} />
                                    {product.farm?.location || 'Việt Nam'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Description */}
                    {product.description && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
                            <Text style={styles.description}>{product.description}</Text>
                        </View>
                    )}

                    {/* Traceability */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Truy xuất nguồn gốc</Text>
                        <TouchableOpacity
                            style={styles.traceabilityButton}
                            onPress={() => router.push(`/traceability/${id}`)}
                        >
                            <MaterialCommunityIcons name="qrcode-scan" size={24} color={Colors.primary} />
                            <View style={styles.traceabilityInfo}>
                                <Text style={styles.traceabilityTitle}>Xem quy trình sản xuất</Text>
                                <Text style={styles.traceabilitySubtitle}>Được xác thực bởi Blockchain</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                        </TouchableOpacity>
                    </View>

                    {/* Quantity Selector */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Số lượng</Text>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                <Ionicons name="remove" size={20} color={Colors.text} />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity
                                style={styles.quantityButton}
                                onPress={() => setQuantity(quantity + 1)}
                            >
                                <Ionicons name="add" size={20} color={Colors.text} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
                    <Ionicons name="cart-outline" size={20} color={Colors.primary} />
                    <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
                    <Text style={styles.buyNowText}>Mua ngay</Text>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        position: 'relative',
        height: 300,
        backgroundColor: '#f3f4f6',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 16,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: Spacing.md,
    },
    header: {
        marginBottom: Spacing.lg,
    },
    certBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#def7ec',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: Spacing.sm,
    },
    certText: {
        marginLeft: 4,
        fontSize: 12,
        color: '#046c4e',
        fontWeight: 'bold',
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
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
    farmCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: Spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    farmInfo: {
        marginLeft: Spacing.md,
        flex: 1,
    },
    farmName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
    },
    farmLocation: {
        fontSize: 14,
        color: Colors.textLight,
    },
    description: {
        fontSize: 15,
        color: Colors.text,
        lineHeight: 22,
    },
    traceabilityButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0F2FE',
        padding: Spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BAE6FD',
    },
    traceabilityInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    traceabilityTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 2,
    },
    traceabilitySubtitle: {
        fontSize: 12,
        color: Colors.textLight,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        alignSelf: 'flex-start',
    },
    quantityButton: {
        padding: Spacing.md,
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        paddingHorizontal: Spacing.lg,
    },
    bottomBar: {
        flexDirection: 'row',
        padding: Spacing.md,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        gap: Spacing.sm,
    },
    addToCartButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: Colors.primary,
        padding: Spacing.md,
        borderRadius: 12,
        gap: 8,
    },
    addToCartText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buyNowButton: {
        flex: 1,
        backgroundColor: Colors.primary,
        padding: Spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buyNowText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
