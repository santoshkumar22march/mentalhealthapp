
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Phone } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

interface CrisisModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function CrisisModal({ visible, onClose }: CrisisModalProps) {
    const callHelpline = (number: string) => {
        Linking.openURL(`tel:${number}`);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* Blur Effect Background */}
                <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

                <View style={styles.card}>
                    <LinearGradient
                        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                        style={StyleSheet.absoluteFill}
                    />

                    <View style={styles.iconContainer}>
                        <Heart fill="#EF4444" color="#EF4444" size={32} />
                    </View>

                    <Text style={styles.title}>You are not alone.</Text>
                    <Text style={styles.message}>
                        We care about you and your safety. Please reach out to someone who can help.
                        Support is available 24/7.
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={() => callHelpline('14416')}
                        >
                            <Phone color="white" size={18} style={{ marginRight: 8 }} />
                            <Text style={styles.buttonText}>Call Tele-MANAS (14416)</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton]}
                            onPress={() => callHelpline('18602662345')}
                        >
                            <Phone color="#94A3B8" size={18} style={{ marginRight: 8 }} />
                            <Text style={styles.secondaryButtonText}>Vandrevala Foundation</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Text style={styles.closeButtonText}>I am safe now</Text>
                        </TouchableOpacity>
                    </View>
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
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    card: {
        width: '100%',
        maxWidth: 340,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.3)', // Red border for urgency
        backgroundColor: '#1E293B',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(239,68,68,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: '#E2E8F0',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    buttonContainer: {
        width: '100%',
        gap: 12,
    },
    button: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
    },
    primaryButton: {
        backgroundColor: '#EF4444',
    },
    secondaryButton: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: '#94A3B8',
        fontSize: 15,
        fontWeight: '500',
    },
    closeButton: {
        padding: 12,
        alignItems: 'center',
        marginTop: 4,
    },
    closeButtonText: {
        color: '#64748B',
        fontSize: 14,
    },
});
