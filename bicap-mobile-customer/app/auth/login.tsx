import React, { useState } from 'react';
import {
    StyleSheet, View, Text, TextInput, TouchableOpacity,
    ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../../constants/Config';
import { Colors, Spacing } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ email và mật khẩu');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });

            const { token, user } = response.data;

            // Allow retailer role to login
            if (user.role !== 'retailer' && user.role !== 'admin') {
                Alert.alert('Lỗi', 'Tài khoản này không có quyền truy cập ứng dụng khách hàng');
                setLoading(false);
                return;
            }

            await login(token, user);
            router.replace('/(tabs)');
        } catch (error: any) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || 'Đăng nhập thất bại';
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
            <View style={styles.content}>
                <Text style={styles.title}>Đăng nhập</Text>
                <Text style={styles.subtitle}>Chào mừng trở lại!</Text>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mật khẩu</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Đăng nhập</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => router.push('/auth/signup')}
                    >
                        <Text style={styles.linkText}>
                            Chưa có tài khoản? <Text style={styles.linkTextBold}>Đăng ký ngay</Text>
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.linkText}>Tiếp tục với tư cách khách</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        padding: Spacing.xl,
        justifyContent: 'center',
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
