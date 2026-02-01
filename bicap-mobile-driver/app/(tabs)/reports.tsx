// app/(tabs)/reports.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    FlatList, ActivityIndicator, Alert, SafeAreaView,
    KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { API_URL } from '../../constants/Config';
import { Colors } from '../../constants/theme';

export default function ReportsScreen() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('incident'); // incident, vehicle, weather, traffic

    const fetchReports = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) return;

            const response = await axios.get(`${API_URL}/reports`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Backend returns a list of reports
            setReports(response.data || []);
        } catch (error) {
            console.error("Lỗi tải báo cáo:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchReports();
        }, [])
    );

    const handleSubmit = async () => {
        if (!title || !content) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập tiêu đề và nội dung báo cáo.');
            return;
        }

        setSubmitting(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.post(`${API_URL}/reports`, {
                title,
                content,
                type,
                receiverRole: 'shipping' // Gửi cho quản lý vận chuyển
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Alert.alert('Thành công', 'Đã gửi báo cáo của bạn!');
            setTitle('');
            setContent('');
            fetchReports();
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể gửi báo cáo');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return { bg: '#FEF3C7', text: '#B45309', label: 'Đang chờ' };
            case 'resolved': return { bg: '#D1FAE5', text: '#065F46', label: 'Đã xử lý' };
            case 'rejected': return { bg: '#FEE2E2', text: '#991B1B', label: 'Từ chối' };
            default: return { bg: '#F3F4F6', text: '#374151', label: status };
        }
    };

    const renderReportItem = ({ item }: { item: any }) => {
        const status = getStatusStyle(item.status);
        return (
            <View style={styles.reportCard}>
                <View style={styles.reportHeader}>
                    <Text style={styles.reportTitle}>{item.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                        <Text style={[styles.statusText, { color: status.text }]}>{status.label}</Text>
                    </View>
                </View>
                <Text style={styles.reportContent}>{item.content}</Text>
                <Text style={styles.reportDate}>{new Date(item.createdAt).toLocaleString('vi-VN')}</Text>

                {item.adminNote && (
                    <View style={styles.adminNote}>
                        <Text style={styles.adminNoteTitle}>Phản hồi từ quản lý:</Text>
                        <Text style={styles.adminNoteText}>{item.adminNote}</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Báo cáo sự cố</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <FlatList
                    data={reports}
                    keyExtractor={(item: any) => item.id.toString()}
                    renderItem={renderReportItem}
                    ListHeaderComponent={
                        <View style={styles.formContainer}>
                            <Text style={styles.sectionTitle}>Gửi báo cáo mới</Text>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Loại sự cố</Text>
                                <View style={styles.typeSelector}>
                                    {[
                                        { id: 'incident', label: 'Sự cố', icon: 'exclamation-circle' },
                                        { id: 'vehicle', label: 'Xe cộ', icon: 'truck' },
                                        { id: 'traffic', label: 'Giao thông', icon: 'map' },
                                    ].map((t) => (
                                        <TouchableOpacity
                                            key={t.id}
                                            onPress={() => setType(t.id)}
                                            style={[styles.typeButton, type === t.id && styles.typeButtonActive]}
                                        >
                                            <FontAwesome name={t.icon as any} size={16} color={type === t.id ? '#fff' : '#4B5563'} />
                                            <Text style={[styles.typeButtonText, type === t.id && { color: '#fff' }]}>{t.label}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Tiêu đề</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="VD: Hỏng lốp xe, Tắc đường..."
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Nội dung chi tiết</Text>
                                <TextInput
                                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                                    placeholder="Mô tả chi tiết sự cố..."
                                    multiline
                                    numberOfLines={4}
                                    value={content}
                                    onChangeText={setContent}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.submitButton, submitting && { opacity: 0.7 }]}
                                onPress={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <>
                                        <FontAwesome name="paper-plane" size={16} color="#fff" style={{ marginRight: 8 }} />
                                        <Text style={styles.submitButtonText}>GỬI BÁO CÁO</Text>
                                    </>
                                )}
                            </TouchableOpacity>

                            <View style={styles.divider} />
                            <Text style={styles.sectionTitle}>Lịch sử báo cáo</Text>
                        </View>
                    }
                    contentContainerStyle={{ paddingBottom: 40 }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            {loading ? (
                                <ActivityIndicator color={Colors.light.tint} />
                            ) : (
                                <Text style={styles.emptyText}>Bạn chưa có báo cáo nào.</Text>
                            )}
                        </View>
                    }
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        alignItems: 'center'
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },

    formContainer: { padding: 20 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#374151', marginBottom: 16 },

    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: '#4B5563', marginBottom: 8 },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16
    },

    typeSelector: { flexDirection: 'row', gap: 10 },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: '#fff'
    },
    typeButtonActive: {
        backgroundColor: Colors.light.tint,
        borderColor: Colors.light.tint
    },
    typeButtonText: { marginLeft: 6, fontSize: 14, fontWeight: '600', color: '#4B5563' },

    submitButton: {
        backgroundColor: Colors.light.tint,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
        marginTop: 8
    },
    submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 24 },

    reportCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4
    },
    reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    reportTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', flex: 1, marginRight: 8 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 11, fontWeight: 'bold' },
    reportContent: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
    reportDate: { fontSize: 12, color: '#9CA3AF', marginTop: 12 },

    adminNote: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: Colors.light.tint
    },
    adminNoteTitle: { fontSize: 13, fontWeight: 'bold', color: '#374151', marginBottom: 4 },
    adminNoteText: { fontSize: 13, color: '#4B5563', fontStyle: 'italic' },

    emptyContainer: { alignItems: 'center', padding: 40 },
    emptyText: { color: '#9CA3AF', fontSize: 14 }
});
