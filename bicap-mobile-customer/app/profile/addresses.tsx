// app/profile/addresses.tsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function AddressesScreen() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Địa chỉ đã lưu</Text>

                <View style={styles.addressCard}>
                    <View style={styles.addressHeader}>
                        <Ionicons name="location" size={20} color={Colors.primary} />
                        <Text style={styles.addressLabel}>Mặc định</Text>
                    </View>
                    <Text style={styles.userName}>{user?.fullName}</Text>
                    <Text style={styles.phone}>{user?.phone || 'Chưa có số điện thoại'}</Text>
                    <Text style={styles.addressText}>{user?.address || 'Chưa cập nhật địa chỉ'}</Text>

                    <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => router.push('/profile/edit-profile')}
                    >
                        <Text style={styles.editBtnText}>Chỉnh sửa</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.addBtn}>
                    <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
                    <Text style={styles.addBtnText}>Thêm địa chỉ mới</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: Spacing.md,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textLight,
        marginBottom: Spacing.md,
    },
    addressCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: Spacing.lg,
    },
    addressHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    addressLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.primary,
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    phone: {
        fontSize: 14,
        color: Colors.textLight,
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: Colors.text,
        lineHeight: 20,
        marginBottom: Spacing.md,
    },
    editBtn: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.sm,
        alignItems: 'center',
    },
    editBtnText: {
        color: Colors.primary,
        fontWeight: '600',
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        gap: 8,
    },
    addBtnText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
});
