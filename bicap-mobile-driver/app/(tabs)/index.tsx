// app/(tabs)/index.tsx
import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator,
  Alert, RefreshControl, StyleSheet, SafeAreaView, Platform
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { API_URL } from '../../constants/Config';
import { Colors } from '../../constants/theme';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import QRScannerModal from '@/components/QRScannerModal';
import PhotoCaptureModal from '@/components/PhotoCaptureModal';

// Import Auth Hook
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  console.log("🚀 HomeScreen Component Rendering (v1.1)");
  const { user, token, logout, isLoading } = useAuth();
  const router = useRouter();

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false); // Default false, wait for auth
  const [refreshing, setRefreshing] = useState(false);

  // QR Scanner states
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [activeShipmentId, setActiveShipmentId] = useState<number | null>(null);
  const [scannerTitle, setScannerTitle] = useState('Quét mã QR');
  const [scannedQRData, setScannedQRData] = useState<string | null>(null);

  // Photo Capture states
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);

  // Protect Route & Load Data
  useFocusEffect(
    useCallback(() => {
      if (!isLoading) {
        if (!user || !token) {
          // Redirect to login if not authenticated
          router.replace('/auth/login');
        } else {
          fetchMyShipments();
        }
      }
    }, [user, token, isLoading])
  );

  // Hàm tải dữ liệu đơn hàng của tài xế
  const fetchMyShipments = async () => {
    try {
      if (!token) return;
      setLoading(true);

      console.log(`📡 Đang tải đơn hàng tại ${API_URL}/driver/shipments`);

      const response = await axios.get(`${API_URL}/driver/shipments`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShipments(response.data.shipments || []);
      console.log(`📡 Đã tải ${response.data.shipments?.length || 0} đơn hàng.`);
      if (response.data.shipments?.length > 0) {
        console.log("Sample status:", response.data.shipments[0].status);
      }

    } catch (error: any) {
      console.error("Lỗi tải đơn:", error);
      const msg = error.response?.data?.message || error.message || "Lỗi kết nối Server";
      Alert.alert("Lỗi tải đơn", msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          }
        }
      ]
    );
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

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Quyền truy cập vị trí bị từ chối');
        return null;
      }
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      return location.coords;
    } catch (error) {
      console.error('Lỗi lấy vị trí:', error);
      return null;
    }
  };

  const handleNavigate = (address: string) => {
    if (!address) return;
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
    });
    if (url) Linking.openURL(url);
  };

  const handleQRScan = async (data: string) => {
    if (!activeShipmentId) return;

    try {
      const shipment: any = shipments.find((s: any) => s.id === activeShipmentId);
      if (!shipment) return;

      const isPickup = shipment.status === 'created' || shipment.status === 'assigned';

      if (isPickup) {
        // Pickup flow: send immediately
        const token = await AsyncStorage.getItem('userToken');
        const coords = await getLocation();
        const response = await axios.post(`${API_URL}/driver/confirm-pickup`, {
          shipmentId: activeShipmentId,
          qrCode: data,
          latitude: coords?.latitude || 0,
          longitude: coords?.longitude || 0
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setIsScannerVisible(false);
        Alert.alert('Thành công', response.data.message || 'Xác nhận nhận hàng thành công!');
        fetchMyShipments();
      } else {
        // Delivery flow: need photo capture next
        setScannedQRData(data);
        setIsScannerVisible(false);
        setTimeout(() => setIsPhotoModalVisible(true), 500); // Small delay for modal transition
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Lỗi xử lý mã QR';
      Alert.alert('Thất bại', msg);
      setIsScannerVisible(false);
    }
  };

  const handlePhotoCaptured = async (base64Photo: string) => {
    if (!activeShipmentId || !scannedQRData) return;

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const coords = await getLocation();

      console.log(`📡 Sending delivery info to ${API_URL}/driver/confirm-delivery`);

      const response = await axios.post(`${API_URL}/driver/confirm-delivery`, {
        shipmentId: activeShipmentId,
        qrCode: scannedQRData,
        latitude: coords?.latitude || 0,
        longitude: coords?.longitude || 0,
        deliveryImage: base64Photo
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsPhotoModalVisible(false);
      setScannedQRData(null);
      Alert.alert('Thành công', response.data.message || 'Xác nhận giao hàng thành công!');
      fetchMyShipments();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Lỗi xác nhận giao hàng';
      Alert.alert('Thất bại', msg);
    } finally {
      setIsPhotoModalVisible(false);
      setLoading(false);
    }
  };

  const handleDemoPickup = (item: any) => {
    Alert.alert(
      "Xác nhận (Demo)",
      `Bạn có muốn xác nhận ĐÃ NHẬN vận đơn #${item.id} ? (Bỏ qua quét QR)`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          onPress: async () => {
            try {
              setLoading(true);
              const token = await AsyncStorage.getItem('userToken');
              const coords = await getLocation();
              const demoQR = `SHIPMENT_${item.id}`; // Giả lập QR chuẩn

              const response = await axios.post(`${API_URL}/driver/confirm-pickup`, {
                shipmentId: item.id,
                qrCode: demoQR,
                latitude: coords?.latitude || 0,
                longitude: coords?.longitude || 0
              }, {
                headers: { Authorization: `Bearer ${token}` }
              });

              Alert.alert('Thành công', 'Đã nhận hàng thành công (Demo)');
              fetchMyShipments();
            } catch (error: any) {
              console.error(error);
              Alert.alert('Lỗi', error.response?.data?.message || 'Không thể nhận hàng');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleDemoDelivery = (item: any) => {
    Alert.alert(
      "Xác nhận (Demo)",
      `Bạn có muốn xác nhận ĐÃ GIAO vận đơn #${item.id} ? (Bỏ qua quét QR & chụp ảnh)`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          onPress: async () => {
            try {
              setLoading(true);
              const token = await AsyncStorage.getItem('userToken');
              const coords = await getLocation();
              const demoQR = `SHIPMENT_${item.id}`; // Giả lập QR chuẩn

              const response = await axios.post(`${API_URL}/driver/confirm-delivery`, {
                shipmentId: item.id,
                qrCode: demoQR,
                latitude: coords?.latitude || 0,
                longitude: coords?.longitude || 0,
                deliveryImage: null // Bỏ qua ảnh
              }, {
                headers: { Authorization: `Bearer ${token}` }
              });

              Alert.alert('Thành công', 'Đã giao hàng thành công (Demo)');
              fetchMyShipments();
            } catch (error: any) {
              console.error(error);
              Alert.alert('Lỗi', error.response?.data?.message || 'Không thể xác nhận giao hàng');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };



  const onRefresh = () => {
    setRefreshing(true);
    fetchMyShipments();
  };

  // Giao diện từng thẻ đơn hàng
  const renderItem = ({ item }: { item: any }) => {
    console.log(`Render Item ${item.id}: Status = ${item.status}`);
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
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Nguồn (Trại)</Text>
                <TouchableOpacity onPress={() => handleNavigate(item.order?.product?.farm?.address)}>
                  <Text style={styles.navLink}>Dẫn đường</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.value} numberOfLines={1}>{pickupLoc}</Text>
              <Text style={styles.subValue} numberOfLines={1}>{item.order?.product?.farm?.address}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { marginTop: 10 }]}>
            <FontAwesome name="map-marker" size={16} color="#10B981" style={{ marginLeft: 1 }} />
            <View style={{ flex: 1 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Đích (Cửa hàng)</Text>
                <TouchableOpacity onPress={() => handleNavigate(item.order?.retailer?.address)}>
                  <Text style={styles.navLink}>Dẫn đường</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.value} numberOfLines={1}>{deliveryLoc}</Text>
              <Text style={styles.subValue} numberOfLines={1}>{item.order?.retailer?.address}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          {(item.status === 'created' || item.status === 'assigned') && (
            <>
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

              {/* DEMO BUTTON */}
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#6366F1', marginTop: 10 }]}
                onPress={() => handleDemoPickup(item)}
              >
                <FontAwesome name="hand-pointer-o" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.actionButtonText}>Đã nhận hàng (Demo)</Text>
              </TouchableOpacity>
            </>
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
            <>
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

              {/* DEMO BUTTON */}
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#6366F1', marginTop: 10 }]}
                onPress={() => handleDemoDelivery(item)}
              >
                <FontAwesome name="hand-pointer-o" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.actionButtonText}>Đã giao hàng (Demo)</Text>
              </TouchableOpacity>
            </>
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
          <Text style={styles.greeting}>Xin chào, {user?.fullName || 'Bác tài'} 👋 (v1.1)</Text>
          <Text style={styles.subGreeting}>Chúc bạn vạn dặm bình an!</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 15 }}>
          <TouchableOpacity onPress={fetchMyShipments}>
            <FontAwesome name="refresh" size={20} color={Colors.light.tint} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <FontAwesome name="sign-out" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>
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

      {/* Proof of Delivery Photo Capture */}
      <PhotoCaptureModal
        visible={isPhotoModalVisible}
        onClose={() => setIsPhotoModalVisible(false)}
        onCapture={handlePhotoCaptured}
        title="Chụp ảnh giao hàng"
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
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 12, color: '#9CA3AF', marginBottom: 2 },
  navLink: { fontSize: 12, color: Colors.light.tint, fontWeight: 'bold', textDecorationLine: 'underline' },
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