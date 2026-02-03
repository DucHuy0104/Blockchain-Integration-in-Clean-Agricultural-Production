// constants/Config.ts
import { Platform } from 'react-native';

// 1. Nếu là Android Emulator -> dùng 10.0.2.2
// 2. Nếu là Web -> dùng localhost
// 3. Nếu là iOS (Máy thật) hoặc Android (Máy thật) -> dùng IP LAN
const COMPUTER_IP = '192.168.1.16'; // IP máy tính của bạn

// 1. Android Emulator: 10.0.2.2
// 2. iOS Simulator: localhost (hoặc computer IP)
// 3. Máy thật (Android/iOS): BẮT BUỘC dùng IP máy tính
const host = Platform.OS === 'android'
    ? (process.env.EXPO_PUBLIC_USE_EMULATOR === 'true' ? '10.0.2.2' : COMPUTER_IP)
    : Platform.OS === 'web' ? 'localhost' : COMPUTER_IP;

export const API_URL = `http://${host}:5001/api`;

console.log(`🌍 App đang chạy trên: ${Platform.OS} -> API: ${API_URL}`);