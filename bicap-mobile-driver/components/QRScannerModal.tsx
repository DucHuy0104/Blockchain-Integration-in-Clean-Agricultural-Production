// components/QRScannerModal.tsx
import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, TouchableOpacity, Modal,
    ActivityIndicator, Alert
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';

interface QRScannerModalProps {
    visible: boolean;
    onClose: () => void;
    onScan: (data: string) => void;
    title: string;
}

export default function QRScannerModal({ visible, onClose, onScan, title }: QRScannerModalProps) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        if (visible && !permission?.granted) {
            requestPermission();
        }
    }, [visible]);

    useEffect(() => {
        if (visible) setScanned(false);
    }, [visible]);

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;
        setScanned(true);
        onScan(data);
    };

    if (!permission) {
        return null;
    }

    if (!permission.granted) {
        return (
            <Modal visible={visible} animationType="slide">
                <View style={styles.container}>
                    <Text style={styles.message}>Chúng tôi cần quyền truy cập Camera để quét mã QR</Text>
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
        <Modal visible={visible} animationType="fade" transparent={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
                        <FontAwesome name="times" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                <CameraView
                    style={styles.camera}
                    onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr"],
                    }}
                >
                    <View style={styles.overlay}>
                        <View style={styles.unfocusedContainer}></View>
                        <View style={styles.middleContainer}>
                            <View style={styles.unfocusedContainer}></View>
                            <View style={styles.focusedContainer}>
                                {/* Border corners for scan area */}
                                <View style={[styles.corner, styles.topLeft]} />
                                <View style={[styles.corner, styles.topRight]} />
                                <View style={[styles.corner, styles.bottomLeft]} />
                                <View style={[styles.corner, styles.bottomRight]} />
                            </View>
                            <View style={styles.unfocusedContainer}></View>
                        </View>
                        <View style={styles.unfocusedContainer}>
                            <Text style={styles.helperText}>Di chuyển mã QR vào khung để quét</Text>
                        </View>
                    </View>
                </CameraView>

                {scanned && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.loadingText}>Đang xử lý mã...</Text>
                    </View>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    camera: { flex: 1 },
    header: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    closeIcon: { padding: 8 },

    overlay: { flex: 1, backgroundColor: 'transparent' },
    unfocusedContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    middleContainer: { flexDirection: 'row', height: 250 },
    focusedContainer: { width: 250, backgroundColor: 'transparent', position: 'relative' },

    corner: { position: 'absolute', width: 40, height: 40, borderColor: '#3B82F6', borderWidth: 4 },
    topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
    topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
    bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
    bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

    helperText: { color: '#fff', fontSize: 14, marginTop: 20, textAlign: 'center' },

    message: { color: '#fff', textAlign: 'center', marginBottom: 20, paddingHorizontal: 40 },
    button: { backgroundColor: '#3B82F6', padding: 15, borderRadius: 10, marginBottom: 15 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    closeButton: { padding: 10 },
    closeButtonText: { color: '#9CA3AF' },

    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: { color: '#fff', marginTop: 10, fontWeight: 'bold' }
});
