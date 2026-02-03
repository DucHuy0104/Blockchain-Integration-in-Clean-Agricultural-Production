// constants/Config.ts
import { Platform } from 'react-native';

const COMPUTER_IP = '192.168.1.16'; // IP máy tính của bạn

// 1. Android Emulator: 10.0.2.2
// 2. iOS Simulator: localhost (hoặc computer IP)
// 3. Máy thật (Android/iOS): BẮT BUỘC dùng IP máy tính
const host = Platform.OS === 'android'
    ? (COMPUTER_IP) // Mặc định dùng IP máy tính cho máy thật
    : Platform.OS === 'web' ? 'localhost' : COMPUTER_IP;

export const API_URL = `http://${host}:5001/api`;

console.log(`🌍 Customer App đang chạy trên: ${Platform.OS} -> API: ${API_URL}`);
