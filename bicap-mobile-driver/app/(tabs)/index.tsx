// app/(tabs)/index.tsx
import React, { useState, useCallback } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, 
  Alert, RefreshControl, StyleSheet, SafeAreaView, Platform
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { API_URL } from '../../constants/Config'; // Đảm bảo bạn đã tạo file Config.ts
import { Colors } from '../../constants/theme';
import { FontAwesome } from '@expo/vector-icons'; // Icon đẹp

export default function HomeScreen() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [driverName, setDriverName] = useState('');

  // Hàm tải dữ liệu đơn hàng của tài xế
  const fetchMyShipments = async () => {
    try {
      // Lấy ID tài xế đã lưu lúc đăng nhập
      const driverId = await AsyncStorage.getItem('userId');
      const name = await AsyncStorage.getItem('driverName');
      setDriverName(name || 'Bác tài');

      if (!driverId) {
        // Nếu chưa đăng nhập (hoặc mất session), set rỗng
        setShipments([]);
        return;
      }

      console.log(`📡 Đang tải đơn hàng cho Tài xế ID: ${driverId} tại ${API_URL}`);
      
      // Gọi API lấy đơn hàng (đã lọc theo driverId)
      const response = await axios.get(`${API_URL}/shipments?driverId=${driverId}`);
      setShipments(response.data);

    } catch (error) {
      console.error("Lỗi tải đơn:", error);
      // Không alert lỗi để tránh spam nếu server tắt, chỉ log thôi
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Tự động tải lại mỗi khi màn hình này được focus (mở lên)
  useFocusEffect(
    useCallback(() => {
      fetchMyShipments();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyShipments();
  };

  // Giao diện từng thẻ đơn hàng
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      {/* Header của thẻ: Mã đơn & Trạng thái */}
      <View style={styles.cardHeader}>
        <View style={styles.row}>
          <FontAwesome name="cube" size={16} color="#4B5563" />
          <Text style={styles.orderId}> Đơn #{item.id}</Text>
        </View>
        
        {/* Badge trạng thái màu mè */}
        <View style={[styles.badge, 
          item.status === 'assigned' ? { backgroundColor: '#DBEAFE' } : // Xanh dương nhạt
          item.status === 'shipping' ? { backgroundColor: '#FEF3C7' } : // Vàng nhạt
          { backgroundColor: '#D1FAE5' } // Xanh lá nhạt (đã giao)
        ]}>
          <Text style={[styles.badgeText, 
            item.status === 'assigned' ? { color: '#1E40AF' } : 
            item.status === 'shipping' ? { color: '#B45309' } : 
            { color: '#065F46' }
          ]}>
            {item.status === 'assigned' ? 'Đang giao' : 
             item.status === 'shipping' ? 'Đang chạy' : 'Hoàn thành'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Thông tin vận chuyển */}
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <FontAwesome name="circle-o" size={14} color="#EF4444" style={{marginTop: 2}} />
          <View style={{flex: 1}}>
            <Text style={styles.label}>Điểm lấy hàng</Text>
            <Text style={styles.value} numberOfLines={2}>{item.diemDi}</Text>
          </View>
        </View>

        <View style={[styles.infoRow, {marginTop: 10}]}>
          <FontAwesome name="map-marker" size={16} color="#10B981" style={{marginLeft: 1}} />
          <View style={{flex: 1}}>
            <Text style={styles.label}>Điểm giao hàng</Text>
            <Text style={styles.value} numberOfLines={2}>{item.diemDen}</Text>
          </View>
        </View>
      </View>

      {/* Nút hành động */}
      {item.status !== 'delivered' && (
        <TouchableOpacity 
          style={styles.scanButton} 
          onPress={() => Alert.alert('Thông báo', 'Tính năng Camera Quét QR sẽ làm ở bước tiếp theo!')}
        >
          <FontAwesome name="qrcode" size={18} color="#fff" style={{marginRight: 8}} />
          <Text style={styles.scanButtonText}>Quét QR Giao Hàng</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header trên cùng */}
      <View style={styles.header}>
        <View>
            <Text style={styles.greeting}>Xin chào, {driverName} 👋</Text>
            <Text style={styles.subGreeting}>Chúc bạn vạn dặm bình an!</Text>
        </View>
        <TouchableOpacity onPress={fetchMyShipments}>
             <FontAwesome name="refresh" size={20} color={Colors.light.tint} />
        </TouchableOpacity>
      </View>

      {/* Danh sách */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.light.tint} style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={shipments}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <FontAwesome name="inbox" size={50} color="#D1D5DB" />
                <Text style={styles.emptyText}>Hiện chưa có đơn hàng nào.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

// Style làm đẹp
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' }, // Màu nền xám nhẹ
  header: { 
    padding: 20, 
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    backgroundColor: '#fff', 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2
  },
  greeting: { fontSize: 20, fontWeight: 'bold', color: '#11181C' },
  subGreeting: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 2 },
    elevation: 3 
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  orderId: { fontWeight: 'bold', fontSize: 16, color: '#374151', marginLeft: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },
  
  infoContainer: { gap: 4 },
  infoRow: { flexDirection: 'row', gap: 12 },
  label: { fontSize: 12, color: '#9CA3AF', marginBottom: 2 },
  value: { fontSize: 15, color: '#1F2937', fontWeight: '500' },
  
  scanButton: { 
    marginTop: 16, 
    backgroundColor: Colors.light.tint, 
    padding: 14, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  scanButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 16, color: '#9CA3AF', fontSize: 16 }
});