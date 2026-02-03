import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../constants/Config';
import { Colors, Spacing, Typography } from '../../constants/theme';

export default function TraceabilityScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [season, setSeason] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTraceabilityData();
    }, [id]);

    const fetchTraceabilityData = async () => {
        try {
            // Fetch comprehensive traceability data (product + season + processes)
            const response = await axios.get(`${API_URL}/public/traceability/product/${id}`);
            const data = response.data.product;

            setProduct(data);
            if (data.season) {
                setSeason(data.season);
                setActivities(data.season.processes || []);
            }
        } catch (error: any) {
            console.error('Error fetching traceability:', error);
            Alert.alert('Lỗi', 'Không thể tải thông tin truy xuất nguồn gốc');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.errorContainer}>
                <Text>Không tìm thấy thông tin sản phẩm</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color={Colors.text}
                    onPress={() => router.back()}
                    style={styles.backIcon}
                />
                <Text style={styles.headerTitle}>Truy xuất nguồn gốc</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Product Info Card */}
                <View style={styles.productCard}>
                    <MaterialCommunityIcons name="leaf" size={32} color={Colors.primary} />
                    <View style={styles.productInfo}>
                        <Text style={styles.productName}>{product.name}</Text>
                        <Text style={styles.farmName}>{product.farm?.name || 'Vườn nhà'}</Text>
                    </View>
                </View>

                {/* Blockchain Verification */}
                <View style={styles.blockchainCard}>
                    <View style={styles.blockchainHeader}>
                        <MaterialCommunityIcons name="shield-check" size={24} color="#10B981" />
                        <Text style={styles.blockchainTitle}>Xác thực Blockchain</Text>
                    </View>
                    <Text style={styles.blockchainText}>
                        Thông tin sản phẩm này được lưu trữ trên blockchain VeChain, đảm bảo tính minh bạch và không thể thay đổi.
                    </Text>
                    {product.blockchainTxHash && (
                        <View style={styles.txHashContainer}>
                            <Text style={styles.txHashLabel}>Transaction Hash:</Text>
                            <Text style={styles.txHash} numberOfLines={1}>{product.blockchainTxHash}</Text>
                        </View>
                    )}
                </View>

                {/* Farm Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin trang trại</Text>
                    <View style={styles.infoCard}>
                        <InfoRow icon="barn" label="Tên trang trại" value={product.farm?.name || 'N/A'} />
                        <InfoRow icon="map-marker" label="Địa chỉ" value={product.farm?.location || 'N/A'} />
                        <InfoRow icon="certificate" label="Chứng nhận" value={product.certification || 'VietGAP'} />
                    </View>
                </View>

                {/* Season Information */}
                {season && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông tin mùa vụ</Text>
                        <View style={styles.infoCard}>
                            <InfoRow icon="calendar" label="Mùa vụ" value={season.name} />
                            <InfoRow icon="sprout" label="Giống cây" value={season.cropType || 'N/A'} />
                            <InfoRow
                                icon="clock-outline"
                                label="Thời gian"
                                value={`${new Date(season.startDate).toLocaleDateString('vi-VN')} - ${new Date(season.endDate).toLocaleDateString('vi-VN')}`}
                            />
                        </View>
                    </View>
                )}

                {/* Farming Activities Timeline */}
                {activities.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Quy trình canh tác</Text>
                        <View style={styles.timeline}>
                            {activities.map((activity: any, index: number) => (
                                <View key={activity.id} style={styles.timelineItem}>
                                    <View style={styles.timelineDot} />
                                    {index < activities.length - 1 && <View style={styles.timelineLine} />}
                                    <View style={styles.activityCard}>
                                        <Text style={styles.activityDate}>
                                            {new Date(activity.date).toLocaleDateString('vi-VN')}
                                        </Text>
                                        <Text style={styles.activityName}>{activity.activityType}</Text>
                                        <Text style={styles.activityDescription}>{activity.description}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* No Activities Message */}
                {activities.length === 0 && (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="information-outline" size={48} color={Colors.border} />
                        <Text style={styles.emptyText}>Chưa có thông tin hoạt động canh tác</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

// Helper component for info rows
const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
    <View style={styles.infoRow}>
        <MaterialCommunityIcons name={icon as any} size={20} color={Colors.textLight} />
        <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        paddingTop: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backIcon: {
        marginRight: Spacing.md,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    content: {
        flex: 1,
        padding: Spacing.md,
    },
    productCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: Spacing.md,
        borderRadius: 12,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    productInfo: {
        marginLeft: Spacing.md,
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    farmName: {
        fontSize: 14,
        color: Colors.textLight,
    },
    blockchainCard: {
        backgroundColor: '#ECFDF5',
        padding: Spacing.md,
        borderRadius: 12,
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    blockchainHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    blockchainTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#065F46',
        marginLeft: Spacing.sm,
    },
    blockchainText: {
        fontSize: 14,
        color: '#047857',
        lineHeight: 20,
    },
    txHashContainer: {
        marginTop: Spacing.sm,
        padding: Spacing.sm,
        backgroundColor: '#D1FAE5',
        borderRadius: 8,
    },
    txHashLabel: {
        fontSize: 12,
        color: '#065F46',
        fontWeight: '600',
        marginBottom: 4,
    },
    txHash: {
        fontSize: 12,
        color: '#047857',
        fontFamily: 'monospace',
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
    },
    infoContent: {
        marginLeft: Spacing.sm,
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: Colors.textLight,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        color: Colors.text,
        fontWeight: '500',
    },
    timeline: {
        position: 'relative',
    },
    timelineItem: {
        position: 'relative',
        paddingLeft: 30,
        marginBottom: Spacing.md,
    },
    timelineDot: {
        position: 'absolute',
        left: 0,
        top: 8,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.primary,
        borderWidth: 2,
        borderColor: '#fff',
    },
    timelineLine: {
        position: 'absolute',
        left: 5,
        top: 20,
        width: 2,
        height: '100%',
        backgroundColor: Colors.border,
    },
    activityCard: {
        backgroundColor: '#fff',
        padding: Spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    activityDate: {
        fontSize: 12,
        color: Colors.textLight,
        marginBottom: 4,
    },
    activityName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    activityDescription: {
        fontSize: 14,
        color: Colors.text,
        lineHeight: 20,
    },
    emptyState: {
        alignItems: 'center',
        padding: Spacing.xl,
    },
    emptyText: {
        marginTop: Spacing.md,
        fontSize: 16,
        color: Colors.textLight,
        textAlign: 'center',
    },
});
