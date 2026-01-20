
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

// Helper for web
WebBrowser.maybeCompleteAuthSession();

type AuthContextType = {
    session: Session | null;
    user: User | null;
    isGuest: boolean;
    isLoading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInAsGuest: () => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    isGuest: false,
    isLoading: true,
    signInWithGoogle: async () => { },
    signInAsGuest: async () => { },
    signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);

    // Load guest state from storage
    useEffect(() => {
        const loadGuestState = async () => {
            const guest = await AsyncStorage.getItem('isGuest');
            if (guest === 'true') {
                setIsGuest(true);
            }
        };
        loadGuestState();
    }, []);

    // Listen for Supabase auth state changes
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session) setIsGuest(false); // If we have a session, we aren't a guest anymore unless explicitly set, but usually session > guest
            setIsLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session) {
                setIsGuest(false);
                AsyncStorage.setItem('isGuest', 'false');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        // TODO: Implement proper Google Sign-In with Supabase
        // This typically requires setting up the URL scheme in app.json and Supabase project settings
        console.log('Initiating Google Sign-In...');
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'nila://login', // Ensure this scheme matches app.json
                }
            });
            if (error) throw error;
            // Logic to handle redirection URL if needed
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
    };

    const signInAsGuest = async () => {
        setIsGuest(true);
        await AsyncStorage.setItem('isGuest', 'true');
        // For guest mode, we effectively consider them "logged in" but without a Supabase session
        // You might want to create an anonymous user in Supabase if you want to track them,
        // but the requirement says "Local only, can link Google later".
        // If you want proper Supabase anonymous auth:
        // const { data, error } = await supabase.auth.signInAnonymously();
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setIsGuest(false);
        await AsyncStorage.removeItem('isGuest');
    };

    return (
        <AuthContext.Provider value={{ session, user, isGuest, isLoading, signInWithGoogle, signInAsGuest, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
