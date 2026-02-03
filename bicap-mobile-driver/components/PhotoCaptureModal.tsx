// components/PhotoCaptureModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity, Modal,
    ActivityIndicator, Image
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

interface PhotoCaptureModalProps {
    visible: boolean;
    onClose: () => void;
    onCapture: (base64: string) => void;
    title: string;
}

export default function PhotoCaptureModal({ visible, onClose, onCapture, title }: PhotoCaptureModalProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState<string | null>(null);
    const [photoData, setPhotoData] = useState<string | null>(null);
    const [capturing, setCapturing] = useState(false);
    const cameraRef = useRef<any>(null);

    useEffect(() => {
        if (visible && (!permission || !permission.granted)) {
            requestPermission();
        }
    }, [visible]);

    useEffect(() => {
        if (visible) {
            setPhoto(null);
            setPhotoData(null);
            setCapturing(false);
        }
    }, [visible]);

    const handleCapture = async () => {
        if (!cameraRef.current || capturing) return;

        try {
            setCapturing(true);
            const result = await cameraRef.current.takePictureAsync({
                quality: 0.5,
                base64: true,
            });
            setPhoto(result.uri);
            if (result.base64) {
                setPhotoData(result.base64);
            }
        } catch (error) {
            console.error('Error capturing photo:', error);
        } finally {
            setCapturing(false);
        }
    };

    const handleConfirm = () => {
        if (photoData) {
            onCapture(`data:image/jpeg;base64,${photoData}`);
        }
    };

    if (!permission) return null;

    if (!permission.granted) {
        return (
            <Modal visible={visible} animationType="slide">
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={styles.message}>Cần quyền Camera để chụp ảnh bằng chứng giao hàng</Text>
                    <TouchableOpacity style={styles.button} onPress={requestPermission}>
                        <Text style={styles.buttonText}>Cấp quyền Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
                        <FontAwesome name="times" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {photo ? (
                    <View style={styles.previewContainer}>
                        <Image source={{ uri: photo }} style={styles.preview} />
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={[styles.footerButton, { backgroundColor: '#4B5563' }]}
                                onPress={() => {
                                    setPhoto(null);
                                    setPhotoData(null);
                                }}
                            >
                                <FontAwesome name="undo" size={18} color="#fff" />
                                <Text style={styles.footerButtonText}>Chụp lại</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.footerButton, { backgroundColor: '#10B981' }]}
                                onPress={handleConfirm}
                            >
                                <FontAwesome name="check" size={18} color="#fff" />
                                <Text style={styles.footerButtonText}>Xác nhận</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <CameraView
                        style={styles.camera}
                        ref={cameraRef}
                        facing="back"
                    >
                        <View style={styles.controls}>
                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={handleCapture}
                                disabled={capturing}
                            >
                                <View style={styles.captureInner} />
                            </TouchableOpacity>
                        </View>
                        {capturing && (
                            <View style={styles.loadingOverlay}>
                                <ActivityIndicator size="large" color="#fff" />
                            </View>
                        )}
                    </CameraView>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingVertical: 10
    },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    closeIcon: { padding: 8 },
    camera: { flex: 1, justifyContent: 'flex-end' },
    controls: {
        paddingBottom: 40,
        alignItems: 'center'
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff'
    },
    captureInner: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#fff'
    },
    previewContainer: { flex: 1 },
    preview: { flex: 1, resizeMode: 'contain' },
    footer: {
        flexDirection: 'row',
        padding: 20,
        paddingBottom: 40,
        backgroundColor: '#000',
        gap: 15
    },
    footerButton: {
        flex: 1,
        flexDirection: 'row',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    footerButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    message: { color: '#fff', textAlign: 'center', marginBottom: 20, paddingHorizontal: 40 },
    button: { backgroundColor: '#3B82F6', padding: 15, borderRadius: 10, marginBottom: 15 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    closeButton: { padding: 10 },
    closeButtonText: { color: '#9CA3AF' },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
