import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Settings } from 'lucide-react-native';
import { useAuth } from "../../context/AuthContext";
import SettingsModal from "../../components/SettingsModal";

const moodEmojis = [
    { label: "Terrible", emoji: "😡", color: '#EF4444' },
    { label: "Bad", emoji: "😞", color: '#F97316' },
    { label: "Okay", emoji: "😐", color: '#EAB308' },
    { label: "Good", emoji: "🙂", color: '#22C55E' },
    { label: "Amazing", emoji: "🤩", color: '#10B981' },
];

const quotes = [
    { text: "You are the sky. Everything else – it's just the weather.", author: "Pema Chödrön" },
    { text: "Be patient with yourself. Self-growth is tender; it's holy ground.", author: "Stephen Covey" },
    { text: "The only way out is through.", author: "Robert Frost" },
    { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
];

export default function Home() {
    const { user } = useAuth();
    const [nickname, setNickname] = useState("Cosmic Traveler");
    const [greeting, setGreeting] = useState("Good Evening,");
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);

    useEffect(() => {
        if (user?.email) {
            setNickname(user.email.split('@')[0]);
        }
        setGreeting(getGreeting());
    }, [user]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning,";
        if (hour < 18) return "Good Afternoon,";
        return "Good Evening,";
    };

    const handleMoodSelect = (index: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedMood(index);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#020617', '#0F172A', '#1E293B']}
                style={StyleSheet.absoluteFill}
            />
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Greeting Section */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.greetingText}>{greeting}</Text>
                            <Text style={styles.nicknameText}>{nickname} ✨</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.settingsButton}
                            onPress={() => setIsSettingsVisible(true)}
                        >
                            <Settings color="#94A3B8" size={24} />
                        </TouchableOpacity>
                    </View>

                    {/* Mood Section */}
                    <View style={styles.card}>
                        <LinearGradient
                            colors={['rgba(96,165,250,0.15)', 'rgba(96,165,250,0.05)']}
                            style={styles.cardGradient}
                        />
                        <Text style={styles.cardTitle}>How is your spirit today?</Text>
                        <Text style={styles.cardSubtitle}>Tap to log your mood</Text>
                        <View style={styles.moodContainer}>
                            {moodEmojis.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.moodButton,
                                        selectedMood === index && {
                                            backgroundColor: item.color + '30',
                                            borderColor: item.color,
                                            transform: [{ scale: 1.1 }]
                                        }
                                    ]}
                                    onPress={() => handleMoodSelect(index)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.moodEmoji}>{item.emoji}</Text>
                                    <Text style={[
                                        styles.moodLabel,
                                        selectedMood === index && { color: item.color }
                                    ]}>{item.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.quickActions}>
                        <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                            <LinearGradient
                                colors={['#3B82F6', '#1D4ED8']}
                                style={styles.actionGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            />
                            <Text style={styles.actionIcon}>💬</Text>
                            <Text style={styles.actionTitle}>Talk to Nila</Text>
                            <Text style={styles.actionSubtitle}>I'm here to listen</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
                            <LinearGradient
                                colors={['#8B5CF6', '#6D28D9']}
                                style={styles.actionGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            />
                            <Text style={styles.actionIcon}>🧘</Text>
                            <Text style={styles.actionTitle}>Breathe</Text>
                            <Text style={styles.actionSubtitle}>Find your calm</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Quote of the Day */}
                    <View style={styles.quoteCard}>
                        <LinearGradient
                            colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
                            style={styles.cardGradient}
                        />
                        <Text style={styles.quoteLabel}>✨ QUOTE OF THE DAY</Text>
                        <Text style={styles.quoteText}>"{quote.text}"</Text>
                        <Text style={styles.quoteAuthor}>— {quote.author}</Text>
                    </View>

                    {/* Streak Card */}
                    <View style={[styles.card, { marginBottom: 120 }]}>
                        <LinearGradient
                            colors={['rgba(34,197,94,0.15)', 'rgba(34,197,94,0.05)']}
                            style={styles.cardGradient}
                        />
                        <View style={styles.streakContent}>
                            <Text style={styles.streakEmoji}>🔥</Text>
                            <View>
                                <Text style={styles.streakNumber}>7 Day Streak!</Text>
                                <Text style={styles.streakSubtext}>Keep showing up for yourself</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <SettingsModal
                    visible={isSettingsVisible}
                    onClose={() => setIsSettingsVisible(false)}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A' },
    safeArea: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 20 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
    },
    settingsButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    greetingText: { color: '#94A3B8', fontSize: 16, fontWeight: '500' },
    nicknameText: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', marginTop: 4 },

    card: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        overflow: 'hidden',
    },
    cardGradient: { ...StyleSheet.absoluteFillObject, borderRadius: 24 },
    cardTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '600', marginBottom: 4 },
    cardSubtitle: { color: '#94A3B8', fontSize: 14, marginBottom: 20 },

    moodContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    moodButton: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'transparent',
        minWidth: 60,
    },
    moodEmoji: { fontSize: 28, marginBottom: 4 },
    moodLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '500' },

    quickActions: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    actionCard: {
        flex: 1,
        borderRadius: 20,
        padding: 20,
        overflow: 'hidden',
        minHeight: 120,
    },
    actionGradient: { ...StyleSheet.absoluteFillObject, borderRadius: 20 },
    actionIcon: { fontSize: 32, marginBottom: 12 },
    actionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    actionSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },

    quoteCard: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        overflow: 'hidden',
    },
    quoteLabel: { color: '#60A5FA', fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 12 },
    quoteText: { color: '#E2E8F0', fontSize: 18, fontStyle: 'italic', lineHeight: 28, marginBottom: 12 },
    quoteAuthor: { color: '#60A5FA', fontSize: 14, fontWeight: '500', textAlign: 'right' },

    streakContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    streakEmoji: { fontSize: 48 },
    streakNumber: { color: '#22C55E', fontSize: 20, fontWeight: 'bold' },
    streakSubtext: { color: '#94A3B8', fontSize: 14, marginTop: 2 },
});
