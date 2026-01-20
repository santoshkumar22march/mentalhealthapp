import "../global.css";
import { Slot } from "expo-router";
import { View, AppState, AppStateStatus } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from '../context/AuthContext';
import ProtectionScreen from '../components/ProtectionScreen';
import React, { useEffect, useState, useRef } from 'react';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
    const appState = useRef(AppState.currentState);
    const [isLocked, setIsLocked] = useState(true); // Start locked for security

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background') {
                setIsLocked(true);
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <AuthProvider>
            <View style={{ flex: 1, backgroundColor: "#0F172A" }}>
                <Slot />
                <ProtectionScreen
                    isLocked={isLocked}
                    onUnlock={() => setIsLocked(false)}
                />
                <StatusBar style="light" />
                <Toast />
            </View>
        </AuthProvider>
    );
}
