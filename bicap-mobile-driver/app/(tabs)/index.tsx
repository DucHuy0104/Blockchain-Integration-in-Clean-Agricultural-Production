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
import { FontAwesome } from '@expo/vector-icons';
import QRScannerModal from '../../components/QRScannerModal';

export default function HomeScreen() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [driverName, setDriverName] = useState('');

  // QR Scanner states
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [activeShipmentId, setActiveShipmentId] = useState<number | null>(null);
  const [scannerTitle, setScannerTitle] = useState('Quét mã QR');

  // Hàm tải dữ liệu đơn hàng của tài xế
  const fetchMyShipments = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const name = await AsyncStorage.getItem('driverName');
      setDriverName(name || 'Bác tài');

      if (!token) {
        setShipments([]);
        return;
      }

      console.log(`📡 Đang tải đơn hàng tại ${API_URL}/driver/shipments`);

      const response = await axios.get(`${API_URL}/driver/shipments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShipments(response.data.shipments || []);

    } catch (error) {
      console.error("Lỗi tải đơn:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateStatus = async (shipmentId: number, status: string) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.put(`${API_URL}/driver/shipments/${shipmentId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Thành công', 'Đã cập nhật trạng thái đơn hàng!');
      fetchMyShipments();
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái');
    }
  };

  const handleQRScan = async (data: string) => {
    if (!activeShipmentId) return;

    try {
      const token = await AsyncStorage.getItem('userToken');
      const shipment: any = shipments.find((s: any) => s.id === activeShipmentId);
      if (!shipment) return;

      const isPickup = shipment.status === 'created' || shipment.status === 'assigned';
      const endpoint = isPickup ? '/driver/confirm-pickup' : '/driver/confirm-delivery';

      console.log(`📡 Sending scan to ${API_URL}${endpoint}`);

      const response = await axios.post(`${API_URL}${endpoint}`, {
        shipmentId: activeShipmentId,
        qrCode: data,
        latitude: 0,
        longitude: 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsScannerVisible(false);
      Alert.alert('Thành công', response.data.message || 'Xác nhận thành công!');
      fetchMyShipments();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Lỗi xử lý mã QR';
      Alert.alert('Thất bại', msg);
      setIsScannerVisible(false);
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
  const renderItem = ({ item }: { item: any }) => {
    const pickupLoc = item.diemDi || item.order?.product?.farm?.name || "N/A";
    const deliveryLoc = item.diemDen || item.order?.retailer?.fullName || "N/A";

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.row}>
            <FontAwesome name="cube" size={16} color="#4B5563" />
            <Text style={styles.orderId}> Vận đơn #{item.id}</Text>
          </View>

          <View style={[styles.badge,
          (item.status === 'assigned' || item.status === 'created') ? { backgroundColor: '#DBEAFE' } :
            item.status === 'picked_up' ? { backgroundColor: '#E0F2FE' } :
              item.status === 'delivering' ? { backgroundColor: '#FEF3C7' } :
                { backgroundColor: '#D1FAE5' }
          ]}>
            <Text style={[styles.badgeText,
            (item.status === 'assigned' || item.status === 'created') ? { color: '#1E40AF' } :
              item.status === 'picked_up' ? { color: '#0369A1' } :
                (item.status === 'delivering' || item.status === 'shipping') ? { color: '#B45309' } :
                  { color: '#065F46' }
            ]}>
              {item.status === 'assigned' || item.status === 'created' ? 'Mới gán' :
                item.status === 'picked_up' ? 'Đã lấy hàng' :
                  item.status === 'delivering' || item.status === 'shipping' ? 'Đang giao' : 'Hoàn thành'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <FontAwesome name="circle-o" size={14} color="#EF4444" style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Nguồn (Trại)</Text>
              <Text style={styles.value} numberOfLines={1}>{pickupLoc}</Text>
              <Text style={styles.subValue} numberOfLines={1}>{item.order?.product?.farm?.address}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { marginTop: 10 }]}>
            <FontAwesome name="map-marker" size={16} color="#10B981" style={{ marginLeft: 1 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Đích (Cửa hàng)</Text>
              <Text style={styles.value} numberOfLines={1}>{deliveryLoc}</Text>
              <Text style={styles.subValue} numberOfLines={1}>{item.order?.retailer?.address}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          {(item.status === 'created' || item.status === 'assigned') && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: Colors.light.tint }]}
              onPress={() => {
                setActiveShipmentId(item.id);
                setScannerTitle('Quét QR Nhận Hàng');
                setIsScannerVisible(true);
              }}
            >
              <FontAwesome name="qrcode" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.actionButtonText}>Quét QR Nhận Hàng</Text>
            </TouchableOpacity>
          )}

          {item.status === 'picked_up' && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#F59E0B' }]}
              onPress={() => handleUpdateStatus(item.id, 'delivering')}
            >
              <FontAwesome name="truck" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.actionButtonText}>Bắt đầu vận chuyển</Text>
            </TouchableOpacity>
          )}

          {(item.status === 'delivering' || item.status === 'shipping') && (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#10B981' }]}
              onPress={() => {
                setActiveShipmentId(item.id);
                setScannerTitle('Quét QR Giao Hàng');
                setIsScannerVisible(true);
              }}
            >
              <FontAwesome name="check-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.actionButtonText}>Quét QR Giao Hàng</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

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
        <ActivityIndicator size="large" color={Colors.light.tint} style={{ marginTop: 50 }} />
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

      {/* Reusable QR Scanner Modal */}
      <QRScannerModal
        visible={isScannerVisible}
        onClose={() => setIsScannerVisible(false)}
        onScan={handleQRScan}
        title={scannerTitle}
      />
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
  value: { fontSize: 15, color: '#1F2937', fontWeight: 'bold' },
  subValue: { fontSize: 13, color: '#6B7280', marginTop: 2 },

  actionButton: {
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },

  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { marginTop: 16, color: '#9CA3AF', fontSize: 16 }
});