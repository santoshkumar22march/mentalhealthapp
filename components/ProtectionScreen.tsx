
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Pressable } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

interface ProtectionScreenProps {
    isLocked: boolean;
    onUnlock: () => void;
}

export default function ProtectionScreen({ isLocked, onUnlock }: ProtectionScreenProps) {
    const [status, setStatus] = useState("Securing your space...");
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);

    useEffect(() => {
        if (!isLocked) return;

        // Breathing animation
        const breathe = Animated.loop(
            Animated.sequence([
                Animated.timing(scale, { toValue: 1.2, duration: 2000, useNativeDriver: true }),
                Animated.timing(scale, { toValue: 1, duration: 2000, useNativeDriver: true }),
            ])
        );
        breathe.start();

        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            setIsBiometricSupported(compatible && enrolled);

            // Small delay to let the UI settle before prompting
            setTimeout(() => authenticate(), 500);
        })();

        return () => breathe.stop();
    }, [isLocked]);

    const authenticate = async () => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock Nila',
                fallbackLabel: 'Use Passcode',
                disableDeviceFallback: false,
                cancelLabel: 'Cancel',
            });

            if (result.success) {
                setStatus("Welcome back.");
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

                // Success Animation: Expand to fill screen
                Animated.parallel([
                    Animated.timing(scale, {
                        toValue: 50, // Massive scale to envelope the screen
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0, // Fade out text
                        duration: 300,
                        useNativeDriver: true,
                    })
                ]).start(() => {
                    onUnlock();
                    // Reset for next time
                    scale.setValue(1);
                    opacity.setValue(1);
                });
            } else {
                setStatus("Tap orb to retry");
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
        } catch (error) {
            console.log('Biometric Auth Error:', error);
            setStatus("Authentication failed");
        }
    };

    if (!isLocked) {
        return null;
    }

    return (
        <View style={[StyleSheet.absoluteFill, styles.container]}>
            <LinearGradient
                colors={['#020617', '#0F172A', '#1E293B']}
                style={StyleSheet.absoluteFill}
            />

            <Animated.View style={[styles.content, { opacity }]}>

                <Pressable onPress={authenticate} style={styles.orbContainer}>
                    <Animated.View
                        style={[
                            styles.orb,
                            { transform: [{ scale }] }
                        ]}
                    >
                        <LinearGradient
                            colors={['#60A5FA', '#3B82F6']}
                            style={styles.orbGradient}
                        />
                    </Animated.View>
                </Pressable>

                <Text style={styles.status}>{status}</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 9999,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    orbContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    orb: {
        width: 100,
        height: 100,
        borderRadius: 50,
        shadowColor: '#60A5FA',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
        elevation: 15,
    },
    orbGradient: {
        flex: 1,
        borderRadius: 50,
    },
    status: {
        fontSize: 18,
        color: '#94A3B8',
        letterSpacing: 1,
        fontWeight: '500',
    },
});
