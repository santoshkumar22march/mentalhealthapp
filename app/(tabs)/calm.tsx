import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Audio } from 'expo-av';
import { Play, Pause, CloudRain, Waves, Wind } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

const BREATHING_PATTERNS = [
    { name: "Box Breathing", inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
    { name: "4-7-8 Relaxing", inhale: 4, hold: 7, exhale: 8, holdAfter: 0 },
    { name: "Simple Calm", inhale: 4, hold: 2, exhale: 6, holdAfter: 0 },
];

const SOUNDSCAPES = [
    { id: 'rain', name: 'Rain', icon: CloudRain, uri: 'https://www.soundjay.com/nature/rain-01.mp3' },
    { id: 'ocean', name: 'Waves', icon: Waves, uri: 'https://www.soundjay.com/nature/ocean-wave-1.mp3' },
    { id: 'wind', name: 'Wind', icon: Wind, uri: 'https://www.soundjay.com/nature/wind-howl-01.mp3' },
];

export default function Calm() {
    const [isActive, setIsActive] = useState(false);
    const [instruction, setInstruction] = useState("Tap to Begin");
    const [secondaryText, setSecondaryText] = useState("Find your center");
    const [patternIndex, setPatternIndex] = useState(0);

    // Sound State
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [activeSoundId, setActiveSoundId] = useState<string | null>(null);

    const scale = useRef(new Animated.Value(1)).current;
    const innerScale = useRef(new Animated.Value(1)).current;
    const glowOpacity = useRef(new Animated.Value(0.3)).current;

    const pattern = BREATHING_PATTERNS[patternIndex];

    const runBreathingCycle = () => {
        const { inhale, hold, exhale, holdAfter } = pattern;

        // INHALE
        setInstruction("Inhale");
        setSecondaryText(`${inhale} seconds`);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        Animated.parallel([
            Animated.timing(scale, { toValue: 1.8, duration: inhale * 1000, useNativeDriver: true }),
            Animated.timing(innerScale, { toValue: 1.5, duration: inhale * 1000, useNativeDriver: true }),
            Animated.timing(glowOpacity, { toValue: 0.8, duration: inhale * 1000, useNativeDriver: true }),
        ]).start();

        setTimeout(() => {
            // HOLD
            if (hold > 0) {
                setInstruction("Hold");
                setSecondaryText(`${hold} seconds`);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            setTimeout(() => {
                // EXHALE
                setInstruction("Exhale");
                setSecondaryText(`${exhale} seconds`);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                Animated.parallel([
                    Animated.timing(scale, { toValue: 1, duration: exhale * 1000, useNativeDriver: true }),
                    Animated.timing(innerScale, { toValue: 1, duration: exhale * 1000, useNativeDriver: true }),
                    Animated.timing(glowOpacity, { toValue: 0.3, duration: exhale * 1000, useNativeDriver: true }),
                ]).start();

                if (holdAfter > 0) {
                    setTimeout(() => {
                        setInstruction("Hold");
                        setSecondaryText(`${holdAfter} seconds`);
                    }, exhale * 1000);
                }
            }, hold * 1000);
        }, inhale * 1000);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            runBreathingCycle();
            const totalCycle = (pattern.inhale + pattern.hold + pattern.exhale + pattern.holdAfter) * 1000;
            interval = setInterval(runBreathingCycle, totalCycle);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, patternIndex]);

    useEffect(() => {
        return () => {
            if (sound) {
                console.log('Unloading Sound');
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const toggleBreathing = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (isActive) {
            setIsActive(false);
            setInstruction("Tap to Begin");
            setSecondaryText("Find your center");
            Animated.parallel([
                Animated.timing(scale, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(innerScale, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(glowOpacity, { toValue: 0.3, duration: 300, useNativeDriver: true }),
            ]).start();
        } else {
            setIsActive(true);
        }
    };

    const nextPattern = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setPatternIndex((prev) => (prev + 1) % BREATHING_PATTERNS.length);
    };

    const handleSoundToggle = async (item: typeof SOUNDSCAPES[0]) => {
        Haptics.selectionAsync();

        if (sound) {
            await sound.unloadAsync();
            setSound(null);

            // If tapping the same sound, just stop it
            if (activeSoundId === item.id) {
                setActiveSoundId(null);
                return;
            }
        }

        // Play new sound
        try {
            console.log('Loading Sound:', item.uri);
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: item.uri },
                { isLooping: true, shouldPlay: true }
            );
            setSound(newSound);
            setActiveSoundId(item.id);
        } catch (error) {
            console.error("Audio Load Error:", error);
            Toast.show({
                type: 'error',
                text1: 'Could not play sound',
                text2: 'Please check your internet connection.'
            });
            setActiveSoundId(null);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#020617', '#0F172A', '#1E293B']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Find Your Calm 🧘</Text>
                    <TouchableOpacity onPress={nextPattern} style={styles.patternButton}>
                        <Text style={styles.patternButtonText}>{pattern.name}</Text>
                    </TouchableOpacity>
                </View>

                {/* Breathing Orb Container */}
                <View style={styles.orbContainer}>
                    {/* Outer Glow */}
                    <Animated.View style={[styles.glowOuter, { opacity: glowOpacity, transform: [{ scale }] }]} />

                    {/* Main Orb */}
                    <Animated.View style={[styles.orbOuter, { transform: [{ scale }] }]}>
                        <LinearGradient
                            colors={['#60A5FA', '#3B82F6', '#2563EB']}
                            style={styles.orbGradient}
                        />
                    </Animated.View>

                    {/* Inner Core */}
                    <Animated.View style={[styles.orbInner, { transform: [{ scale: innerScale }] }]}>
                        <LinearGradient
                            colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                            style={styles.innerGradient}
                        />
                    </Animated.View>
                </View>

                {/* Instructions */}
                <View style={styles.instructionContainer}>
                    <Text style={styles.instructionText}>{instruction}</Text>
                    <Text style={styles.secondaryText}>{secondaryText}</Text>
                </View>

                {/* Soundscapes */}
                <View style={styles.soundscapesRow}>
                    {SOUNDSCAPES.map((item) => {
                        const Icon = item.icon;
                        const isPlaying = activeSoundId === item.id;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.soundButton, isPlaying && styles.soundButtonActive]}
                                onPress={() => handleSoundToggle(item)}
                            >
                                <Icon size={20} color={isPlaying ? '#FFFFFF' : '#94A3B8'} />
                                <Text style={[styles.soundText, isPlaying && styles.soundTextActive]}>{item.name}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Control Button */}
                <TouchableOpacity
                    onPress={toggleBreathing}
                    style={styles.controlButton}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={isActive ? ['#EF4444', '#DC2626'] : ['#3B82F6', '#2563EB']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                    <Text style={styles.buttonText}>{isActive ? "Stop" : "Start Breathing"}</Text>
                </TouchableOpacity>

                {/* Tips */}
                <View style={styles.tipsContainer}>
                    <Text style={styles.tipText}>💡 Tip: Practice for 5 minutes daily for best results</Text>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A' },
    safeArea: { flex: 1, alignItems: 'center' },

    header: {
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 20,
        width: '100%',
    },
    headerTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
    patternButton: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    patternButtonText: { color: '#60A5FA', fontSize: 14, fontWeight: '600' },

    orbContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 300,
    },
    glowOuter: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#60A5FA',
    },
    orbOuter: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        overflow: 'hidden',
        shadowColor: '#60A5FA',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 30,
        elevation: 20,
    },
    orbGradient: { flex: 1, borderRadius: 70 },
    orbInner: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
    },
    innerGradient: { flex: 1, borderRadius: 40 },

    instructionContainer: { alignItems: 'center', marginBottom: 40 },
    instructionText: { color: '#FFFFFF', fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
    secondaryText: { color: '#94A3B8', fontSize: 16 },

    controlButton: {
        borderRadius: 30,
        overflow: 'hidden',
        marginBottom: 24,
    },
    buttonGradient: { paddingVertical: 16, paddingHorizontal: 48 },
    buttonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', textAlign: 'center' },

    tipsContainer: {
        paddingHorizontal: 40,
        paddingBottom: 120,
    },
    tipText: { color: '#64748B', fontSize: 14, textAlign: 'center' },

    soundscapesRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 30,
        width: '100%',
    },
    soundButton: {
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        minWidth: 80,
    },
    soundButtonActive: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    soundText: {
        color: '#94A3B8',
        fontSize: 12,
        marginTop: 6,
        fontWeight: '500',
    },
    soundTextActive: {
        color: '#FFFFFF',
    },
});
