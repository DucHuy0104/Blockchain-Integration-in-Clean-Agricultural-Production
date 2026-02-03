import React, { useState } from 'react';
import {
    StyleSheet, View, Text, TextInput, TouchableOpacity,
    ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Image
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../../constants/Config';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

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
            console.log(`Connecting to ${API_URL}/auth/login...`);
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });

            const { token, user } = response.data;

            // Check correct role
            if (user.role !== 'driver' && user.role !== 'admin' && user.role !== 'shipping') {
                Alert.alert('Lỗi truy cập', 'Tài khoản này không phải là Tài Xế');
                setLoading(false);
                return;
            }

            await login(token, user);
            router.replace('/(tabs)');
        } catch (error: any) {
            console.error('Login error:', error);
            const message = error.response?.data?.message || 'Đăng nhập thất bại. Kiểm tra kết nối mạng.';
            Alert.alert('Lỗi đăng nhập', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <FontAwesome name="truck" size={40} color="#fff" />
                </View>
                <Text style={styles.appName}>BICAP DRIVER</Text>
                <Text style={styles.appDesc}>Ứng dụng dành cho Tài xế</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Đăng nhập</Text>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="hung.driver@logistics.vn"
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

                    <View style={styles.helpContainer}>
                        <Text style={styles.helpText}>Mật khẩu mặc định: 123456</Text>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.tint,
    },
    header: {
        flex: 0.35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.tint,
    },
    iconContainer: {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
    },
    appDesc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    content: {
        flex: 0.65,
        backgroundColor: '#F3F4F6',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 24,
        textAlign: 'center',
    },
    form: {
        gap: 16,
    },
    inputContainer: {
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1F2937',
    },
    button: {
        backgroundColor: Colors.light.tint,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    helpContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    helpText: {
        color: '#6B7280',
        fontSize: 13,
    }
});
