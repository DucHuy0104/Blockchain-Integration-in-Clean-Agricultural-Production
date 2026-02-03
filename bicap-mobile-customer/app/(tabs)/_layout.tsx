import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chợ',
          headerTitle: 'Chợ Nông Sản BICAP',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="storefront-outline" size={24} color={color} />,
          headerRight: () => {
            const { itemCount } = require('../../contexts/CartContext').useCart();
            const router = require('expo-router').useRouter();
            return (
              <TouchableOpacity
                style={{ marginRight: 15, position: 'relative' }}
                onPress={() => router.push('/cart')}
              >
                <Ionicons name="cart-outline" size={28} color={Colors.primary} />
                {itemCount > 0 && (
                  <View style={{
                    position: 'absolute',
                    right: -2,
                    top: -2,
                    backgroundColor: Colors.error,
                    borderRadius: 10,
                    width: 18,
                    height: 18,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1.5,
                    borderColor: '#fff'
                  }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{itemCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Khám phá',
          headerTitle: 'Kiến Thức & Tin Tức',
          tabBarIcon: ({ color }) => <Ionicons name="newspaper-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Thông báo',
          headerTitle: 'Thông Báo',
          tabBarIcon: ({ color }) => <Ionicons name="notifications-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá nhân',
          headerTitle: 'Cá Nhân',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-circle" size={24} color={color} />,
        }}
      />
      {/* Hide the default two.tsx if it still exists */}
      <Tabs.Screen
        name="two"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
