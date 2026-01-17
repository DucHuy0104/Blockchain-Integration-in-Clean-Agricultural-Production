import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
// Đảm bảo import đúng đường dẫn tới file theme
import { Colors } from '../../constants/theme';
// Import thư viện Icon
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Lấy màu tint (xanh) từ file theme.ts
        tabBarActiveTintColor: Colors.light.tint,
        // Ẩn thanh tiêu đề phía trên (để màn hình index.tsx tự quản lý)
        headerShown: false,
        // Tinh chỉnh thanh Tab bar cho đẹp trên iOS/Android
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}>

      {/* Tab 1: Trang chủ (Tương ứng với file index.tsx) */}
      <Tabs.Screen
        name="index" 
        options={{
          title: 'Đơn hàng',
          tabBarIcon: ({ color }) => <FontAwesome name="cube" size={24} color={color} />,
        }}
      />

      {/* Bạn có thể thêm các Tab khác ở dưới đây (ví dụ: Tài khoản, Thông báo...) */}
      
    </Tabs>
  );
}
