import React from 'react';
import {
    StyleSheet, View, Text, FlatList,
    Image, TouchableOpacity, ScrollView
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../../constants/theme';

const ARTICLES = [
    {
        id: 1,
        title: 'Tiêu chuẩn VietGAP trong canh tác lúa',
        category: 'Kiến thức',
        image: 'https://images.unsplash.com/photo-1530507629858-e4977d33e9e6?w=500&q=80',
        readTime: '5 phút',
    },
    {
        id: 2,
        title: 'Cách bón phân hữu cơ hiệu quả cho cây ăn trái',
        category: 'Kỹ thuật',
        image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&q=80',
        readTime: '8 phút',
    },
    {
        id: 3,
        title: 'Công nghệ Blockchain trong truy xuất nguồn gốc',
        category: 'Công nghệ',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&q=80',
        readTime: '6 phút',
    }
];

export default function DiscoverScreen() {
    const renderArticle = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.articleCard}>
            <Image source={{ uri: item.image }} style={styles.articleImage} />
            <View style={styles.articleContent}>
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text style={styles.articleTitle}>{item.title}</Text>
                <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={14} color={Colors.textLight} />
                    <Text style={styles.metaText}>{item.readTime}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Featured Banner */}
            <View style={styles.featuredContainer}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80' }}
                    style={styles.featuredImage}
                />
                <View style={styles.featuredOverlay}>
                    <Text style={styles.featuredTag}>Nổi bật</Text>
                    <Text style={styles.featuredTitle}>Nông nghiệp bền vững: Xu hướng của tương lai</Text>
                </View>
            </View>

            {/* Sections */}
            <View style={styles.sectionHeader}>
                <Text style={Typography.h2}>Bài viết giáo dục</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>Xem tất cả</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={ARTICLES}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderArticle}
                contentContainerStyle={styles.articleList}
            />

            {/* Video Section Placeholder */}
            <View style={styles.sectionHeader}>
                <Text style={Typography.h2}>Video hướng dẫn</Text>
            </View>

            <TouchableOpacity style={styles.videoCard}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1464226184884-fa280b87c3a9?w=800&q=80' }}
                    style={styles.videoThumbnail}
                />
                <View style={styles.playIconContainer}>
                    <Ionicons name="play" size={32} color="#fff" />
                </View>
                <View style={styles.videoInfo}>
                    <Text style={styles.videoTitle}>Quy trình kiểm định an toàn thực phẩm tại trang trại</Text>
                </View>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    featuredContainer: {
        margin: Spacing.md,
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    featuredImage: { width: '100%', height: '100%' },
    featuredOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Spacing.md,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    featuredTag: {
        color: Colors.accent,
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    featuredTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        marginTop: Spacing.md,
        marginBottom: Spacing.sm,
    },
    seeAll: { color: Colors.primary, fontWeight: '600' },

    articleList: { paddingLeft: Spacing.md, paddingBottom: Spacing.sm },
    articleCard: {
        width: 240,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginRight: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },
    articleImage: { width: '100%', height: 120 },
    articleContent: { padding: Spacing.sm },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 6,
    },
    categoryText: { fontSize: 10, color: Colors.textLight, fontWeight: 'bold' },
    articleTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.text, height: 40 },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    metaText: { fontSize: 12, color: Colors.textLight, marginLeft: 4 },

    videoCard: {
        margin: Spacing.md,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 2,
        position: 'relative',
    },
    videoThumbnail: { width: '100%', height: 180 },
    playIconContainer: {
        position: 'absolute',
        top: '30%',
        left: '45%',
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    videoInfo: { padding: Spacing.md },
    videoTitle: { fontSize: 15, fontWeight: 'bold', color: Colors.text },
});
