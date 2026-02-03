import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, FlatList, TextInput,
  TouchableOpacity, Image, ActivityIndicator, RefreshControl
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../../constants/Config';
import { Colors, Spacing, Typography } from '../../constants/theme';

export default function MarketScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  const categories = ['Tất cả', 'Trái cây', 'Rau củ', 'Gia vị', 'Khác'];

  const fetchProducts = async () => {
    try {
      console.log(`📡 Fetching products from ${API_URL}/public/products`);
      const response = await axios.get(`${API_URL}/public/products`);
      const data = response.data.products || [];
      setProducts(data);
      applyFilters(data, searchQuery, activeCategory);
    } catch (error: any) {
      console.error('Lỗi tải sản phẩm:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const applyFilters = (data: any[], query: string, category: string) => {
    let filtered = data;
    if (query) {
      filtered = filtered.filter((p: any) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.farm?.name?.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (category !== 'Tất cả') {
      // Since categories are null in DB, show all products for now
      filtered = filtered.filter((p: any) => p.category === category || !p.category);
    }
    setFilteredProducts(filtered);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    applyFilters(products, text, activeCategory);
  };

  const handleCategoryPress = (category: string) => {
    setActiveCategory(category);
    applyFilters(products, searchQuery, category);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderProductItem = ({ item }: { item: any }) => {
    // Construct full image URL from backend
    const imageUrl = item.image
      ? item.image.startsWith('http')
        ? item.image
        : `http://192.168.1.16:5001${item.image}`
      : 'https://via.placeholder.com/150?text=No+Image';

    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.farmName} numberOfLines={1}>
            <MaterialCommunityIcons name="map-marker-outline" size={12} color={Colors.textLight} /> {item.farm?.name || 'Vườn nhà'}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{Number(item.price || 0).toLocaleString()}đ</Text>
            <View style={styles.certBadge}>
              <Text style={styles.certText}>{item.certification || 'VietGAP'}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.textLight} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm sản phẩm, trang trại..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Category List */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleCategoryPress(item)}
              style={[
                styles.categoryItem,
                activeCategory === item && styles.activeCategoryItem
              ]}
            >
              <Text style={[
                styles.categoryText,
                activeCategory === item && styles.activeCategoryText
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Product List */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          numColumns={2}
          contentContainerStyle={styles.productList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="basket-outline" size={60} color={Colors.border} />
              <Text style={styles.emptyText}>Không tìm thấy sản phẩm phù hợp.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchContainer: {
    margin: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 44, fontSize: 16 },

  categoryContainer: { marginBottom: Spacing.sm },
  categoryList: { paddingHorizontal: Spacing.md },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeCategoryItem: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: { color: Colors.textLight, fontWeight: '600' },
  activeCategoryText: { color: '#fff' },

  productList: { padding: Spacing.sm },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 6,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: { width: '100%', height: 120, backgroundColor: '#f3f4f6' },
  productInfo: { padding: 8 },
  productName: { fontSize: 15, fontWeight: 'bold', color: Colors.text },
  farmName: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 },
  price: { fontSize: 14, color: Colors.primary, fontWeight: 'bold' },
  certBadge: { backgroundColor: '#def7ec', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  certText: { fontSize: 10, color: '#046c4e', fontWeight: 'bold' },

  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, color: Colors.textLight, fontSize: 16 },
});
