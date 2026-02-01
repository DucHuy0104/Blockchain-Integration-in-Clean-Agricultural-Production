// constants/Config.ts
import { Platform } from 'react-native';

// 1. Nếu là Android Emulator -> dùng 10.0.2.2
// 2. Nếu là Web -> dùng localhost
// 3. Nếu là iOS (Máy thật) hoặc Android (Máy thật) -> dùng IP LAN
const host = Platform.OS === 'android' ? '10.0.2.2' :
    Platform.OS === 'web' ? 'localhost' :
        '192.168.1.16'; // IP máy tính của bạn (lấy từ Metro logs)

export const API_URL = `http://${host}:5001/api`;

console.log(`🌍 App đang chạy trên: ${Platform.OS} -> API: ${API_URL}`);