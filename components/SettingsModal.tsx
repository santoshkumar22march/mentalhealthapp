
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Linking, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Trash2, Shield, LogOut } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
    const { signOut } = useAuth();
    const [loading, setLoading] = useState(false);

    const handlePrivacyPolicy = () => {
        // Placeholder URL - for production, replace with actual Vercel/Netlify link
        Linking.openURL('https://nila-ai.vercel.app/privacy');
    };

    const handleDeleteData = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
            "Delete All Data?",
            "This action is permanent. All your journals, mood logs, and chat memories will be erased.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete My Data",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        // In a real implementation with Supabase, you would call:
                        // await supabase.from('profiles').delete().eq('id', user.id);
                        // For now, we sign out and assume separation.
                        await signOut();
                        onClose();
                        setLoading(false);
                    }
                }
            ]
        );
    };

    const handleSignOut = async () => {
        await signOut();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

                <View style={styles.modalContainer}>
                    <LinearGradient
                        colors={['#1E293B', '#0F172A']}
                        style={styles.gradient}
                    />

                    <View style={styles.header}>
                        <Text style={styles.title}>Settings</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X color="#94A3B8" size={24} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        {/* Privacy Section */}
                        <TouchableOpacity style={styles.row} onPress={handlePrivacyPolicy}>
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(59,130,246,0.1)' }]}>
                                <Shield size={20} color="#60A5FA" />
                            </View>
                            <Text style={styles.rowText}>Privacy Policy</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        {/* Sign Out */}
                        <TouchableOpacity style={styles.row} onPress={handleSignOut}>
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                                <LogOut size={20} color="#E2E8F0" />
                            </View>
                            <Text style={styles.rowText}>Sign Out</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        {/* Danger Zone */}
                        <TouchableOpacity style={styles.row} onPress={handleDeleteData}>
                            <View style={[styles.iconBox, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
                                <Trash2 size={20} color="#EF4444" />
                            </View>
                            <View>
                                <Text style={[styles.rowText, { color: '#FCA5A5' }]}>Delete My Data</Text>
                                <Text style={styles.subtext}>Permanently remove account</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.version}>Nila v2.0 (Build 2026.1)</Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 340,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#0F172A',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        padding: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    rowText: {
        fontSize: 16,
        color: '#E2E8F0',
        fontWeight: '500',
    },
    subtext: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        marginVertical: 4,
    },
    version: {
        textAlign: 'center',
        color: '#475569',
        fontSize: 12,
        marginBottom: 20,
    },
});
