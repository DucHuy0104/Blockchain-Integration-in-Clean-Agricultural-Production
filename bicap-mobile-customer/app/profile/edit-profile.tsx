// app/profile/edit-profile.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../constants/Config';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function EditProfileScreen() {
    const router = useRouter();
    const { user, token, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });

    const handleSave = async () => {
        if (!formData.fullName) {
            Alert.alert('Lỗi', 'Họ và tên không được để trống');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.put(
                `${API_URL}/retailer/profile`,
                {
                    businessName: formData.fullName,
                    businessAddress: formData.address
                    // Note: Update logic might need tweaking based on backend's exact fields
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Also update User basic info if needed (assuming backend updates both)
            // For simplicity, we refresh the local user data
            const updatedUser = { ...user, fullName: formData.fullName, phone: formData.phone, address: formData.address };
            await login(token!, updatedUser as any);

            Alert.alert('Thành công', 'Thông tin đã được cập nhật');
            router.back();
        } catch (error: any) {
            console.error('Update profile error:', error);
            Alert.alert('Lỗi', error.response?.data?.message || 'Không thể cập nhật thông tin');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Họ và tên</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.fullName}
                        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                        placeholder="Nhập họ và tên"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Số điện thoại</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.phone}
                        onChangeText={(text) => setFormData({ ...formData, phone: text })}
                        placeholder="Nhập số điện thoại"
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Địa chỉ giao hàng mặc định</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.address}
                        onChangeText={(text) => setFormData({ ...formData, address: text })}
                        placeholder="Nhập địa chỉ nhận hàng"
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.saveBtn, loading && styles.disabledBtn]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
                    )}
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
    form: {
        padding: Spacing.md,
    },
    inputContainer: {
        marginBottom: Spacing.lg,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.textLight,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        padding: Spacing.md,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveBtn: {
        backgroundColor: Colors.primary,
        padding: Spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: Spacing.xl,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledBtn: {
        opacity: 0.7,
    },
});
