import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout, isLoading } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'Đăng xuất',
            'Bạn có chắc muốn đăng xuất?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Đăng xuất',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        Alert.alert('Thành công', 'Đã đăng xuất khỏi tài khoản');
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text>Đang tải...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={Typography.h1}>Cá nhân</Text>
            </View>

            {user ? (
                // Logged in view
                <View style={styles.content}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={40} color={Colors.primary} />
                        </View>
                        <Text style={styles.userName}>{user.fullName}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                    </View>

                    <View style={styles.menuSection}>
                        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/orders')}>
                            <Ionicons name="receipt-outline" size={24} color={Colors.text} />
                            <Text style={styles.menuText}>Đơn hàng của tôi</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile/edit-profile')}>
                            <Ionicons name="person-outline" size={24} color={Colors.text} />
                            <Text style={styles.menuText}>Thông tin cá nhân</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile/addresses')}>
                            <Ionicons name="location-outline" size={24} color={Colors.text} />
                            <Text style={styles.menuText}>Địa chỉ giao hàng</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/cart')}>
                            <Ionicons name="cart-outline" size={24} color={Colors.text} />
                            <Text style={styles.menuText}>Giỏ hàng của tôi</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // Guest view
                <View style={styles.guestContainer}>
                    <Ionicons name="person-circle-outline" size={80} color={Colors.border} />
                    <Text style={styles.guestText}>Bạn đang truy cập với tư cách Khách.</Text>
                    <Text style={styles.guestSubtext}>Đăng nhập để trải nghiệm đầy đủ tính năng</Text>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => router.push('/auth/login')}
                    >
                        <Text style={styles.loginButtonText}>Đăng nhập ngay</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        padding: Spacing.lg,
        paddingTop: 60,
        backgroundColor: Colors.card,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    content: {
        padding: Spacing.md,
    },
    userInfo: {
        alignItems: 'center',
        padding: Spacing.xl,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: Spacing.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E0F2FE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: Colors.textLight,
    },
    menuSection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    menuText: {
        flex: 1,
        marginLeft: Spacing.md,
        fontSize: 16,
        color: Colors.text,
    },
    logoutButton: {
        backgroundColor: '#FEE2E2',
        padding: Spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: Spacing.xl,
    },
    logoutText: {
        color: '#DC2626',
        fontWeight: 'bold',
        fontSize: 16,
    },
    guestContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.xl,
    },
    guestText: {
        ...Typography.body,
        textAlign: 'center',
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
        color: Colors.text,
        fontWeight: '600',
    },
    guestSubtext: {
        ...Typography.body,
        textAlign: 'center',
        marginBottom: Spacing.xl,
        color: Colors.textLight,
    },
    loginButton: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
