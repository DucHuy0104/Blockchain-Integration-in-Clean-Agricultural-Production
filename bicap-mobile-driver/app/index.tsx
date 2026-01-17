// app/index.tsx
import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, 
  ActivityIndicator, StyleSheet, Image, KeyboardAvoidingView, Platform 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { API_URL } from '../constants/Config';
import { Colors } from '../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  
  // Tài khoản test mặc định (Tài xế số 1)
  const [email, setEmail] = useState('driver1@ship.com'); 
  const [password, setPassword] = useState('123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập Email và Mật khẩu');
      return;
    }

    setLoading(true);
    try {
      console.log(`🚀 Connecting to: ${API_URL}/auth/login`);

      const response = await axios.post(`${API_URL}/auth/login`, {
        email, password
      });

      const { token, user } = response.data;

      // Kiểm tra quyền
      if (user.role !== 'driver') {
        Alert.alert('Lỗi truy cập', 'App này chỉ dành cho Tài xế!');
        setLoading(false);
        return;
      }

      // Lưu token vào máy
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userId', user.id.toString());
      await AsyncStorage.setItem('driverName', user.fullName);

      // Chuyển vào màn hình chính (Tabs)
      router.replace('/(tabs)'); 

    } catch (error: any) {
      console.error('Login Error:', error);
      const msg = error.response?.data?.message || 'Không thể kết nối Server';
      Alert.alert('Đăng nhập thất bại', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: Colors.light.background }]}
    >
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.header}>
          <Image 
            source={require('../assets/images/react-logo.png')} 
            style={styles.logo} 
          />
          <Text style={styles.title}>BICAP Driver</Text>
          <Text style={styles.subtitle}>Đối tác vận chuyển tin cậy</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email / SĐT</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tài khoản..."
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu..."
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            onPress={handleLogin}
            disabled={loading}
            style={[styles.button, { backgroundColor: Colors.light.tint }]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 80, height: 80, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#11181C' },
  subtitle: { fontSize: 16, color: '#687076' },
  form: { gap: 20 },
  inputContainer: { gap: 8 },
  label: { fontWeight: '600', color: '#333' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', padding: 15, borderRadius: 12, backgroundColor: '#F9FAFB', fontSize: 16 },
  button: { padding: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, elevation: 3 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});