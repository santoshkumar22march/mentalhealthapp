
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface NebulaProps {
    size?: number;
    color?: string;
}

export default function Nebula({ size = 20, color = '#A78BFA' }: NebulaProps) {
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
        const breathe = Animated.loop(
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(scale, {
                        toValue: 1.5,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scale, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.sequence([
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0.6,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ])
            ])
        );

        breathe.start();

        return () => breathe.stop();
    }, []);

    return (
        <View style={[styles.container, { width: size * 1.5, height: size * 1.5 }]}>
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    {
                        transform: [{ scale }],
                        opacity,
                    },
                ]}
            >
                <LinearGradient
                    colors={[color, 'transparent']}
                    style={styles.gradient}
                    start={{ x: 0.5, y: 0.5 }}
                    end={{ x: 1, y: 1 }}
                />
            </Animated.View>
            <View style={[styles.core, { width: size / 2, height: size / 2, backgroundColor: color }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradient: {
        flex: 1,
        borderRadius: 999,
    },
    core: {
        borderRadius: 999,
        backgroundColor: '#FFFFFF',
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
});
