import React, { useState } from 'react';
import {
    StyleSheet, View, Text, TextInput, TouchableOpacity,
    ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../../constants/Config';
import { Colors, Spacing } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!formData.email || !formData.password || !formData.fullName) {
            Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/signup`, {
                email: formData.email,
                password: formData.password,
                full_name: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                role: 'retailer' // Register as retailer (customer)
            });

            const { token, user } = response.data;
            await login(token, user);

            Alert.alert('Thành công', 'Đăng ký tài khoản thành công!', [
                { text: 'OK', onPress: () => router.replace('/(tabs)') }
            ]);
        } catch (error: any) {
            console.error('Register error:', error);
            const message = error.response?.data?.message || 'Đăng ký thất bại';
            Alert.alert('Lỗi', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <Text style={styles.title}>Đăng ký</Text>
                    <Text style={styles.subtitle}>Tạo tài khoản mới</Text>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Họ và tên *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Nguyễn Văn A"
                                value={formData.fullName}
                                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="email@example.com"
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Mật khẩu *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Tối thiểu 6 ký tự"
                                value={formData.password}
                                onChangeText={(text) => setFormData({ ...formData, password: text })}
                                secureTextEntry
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Số điện thoại</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0123456789"
                                value={formData.phone}
                                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Địa chỉ</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Địa chỉ giao hàng"
                                value={formData.address}
                                onChangeText={(text) => setFormData({ ...formData, address: text })}
                                multiline
                                numberOfLines={2}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleRegister}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Đăng ký</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.linkButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.linkText}>
                                Đã có tài khoản? <Text style={styles.linkTextBold}>Đăng nhập</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: Spacing.xl,
        paddingTop: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textLight,
        marginBottom: Spacing.xl,
    },
    form: {
        gap: Spacing.md,
    },
    inputContainer: {
        gap: Spacing.sm,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        padding: Spacing.md,
        fontSize: 16,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: Spacing.md,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: Spacing.md,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkButton: {
        alignItems: 'center',
        padding: Spacing.sm,
    },
    linkText: {
        color: Colors.textLight,
        fontSize: 14,
    },
    linkTextBold: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
});
