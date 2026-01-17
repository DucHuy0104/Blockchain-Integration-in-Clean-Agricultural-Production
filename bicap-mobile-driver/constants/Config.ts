// constants/Config.ts
import { Platform } from 'react-native';

// 1. Nếu là Android Emulator -> dùng 10.0.2.2
// 2. Nếu là Web hoặc iOS Simulator -> dùng localhost
const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_URL = `http://${host}:5001/api`;

console.log(`🌍 App đang chạy trên: ${Platform.OS} -> API: ${API_URL}`);