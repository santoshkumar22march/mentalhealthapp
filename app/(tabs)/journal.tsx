import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const MOCK_MOOD_DATA = [
    { day: 0, mood: 3 }, { day: 1, mood: 4 }, { day: 2, mood: 2 },
    { day: 3, mood: 5 }, { day: 4, mood: 3 }, { day: 5, mood: 4 }, { day: 6, mood: null },
];

const getMoodColor = (mood: number | null) => {
    if (mood === null) return '#334155';
    const colors = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#10B981'];
    return colors[mood - 1] || '#64748B';
};

const getMoodEmoji = (mood: number | null) => {
    if (mood === null) return '•';
    const emojis = ['😡', '😞', '😐', '🙂', '🤩'];
    return emojis[mood - 1] || '•';
};

export default function Journal() {
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const tags = ['Work', 'School', 'Family', 'Friends', 'Health', 'Sleep', 'Exercise', 'Food'];

    const handleMoodSelect = (mood: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedMood(mood);
    };

    const toggleTag = (tag: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
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
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Your Journey 📖</Text>
                        <Text style={styles.headerSubtitle}>Track your emotional patterns</Text>
                    </View>

                    {/* Today's Check-in */}
                    <View style={styles.card}>
                        <LinearGradient
                            colors={['rgba(96,165,250,0.15)', 'rgba(96,165,250,0.05)']}
                            style={styles.cardGradient}
                        />
                        <Text style={styles.cardTitle}>Today's Check-in</Text>
                        <Text style={styles.cardSubtitle}>How are you feeling right now?</Text>

                        <View style={styles.moodRow}>
                            {[1, 2, 3, 4, 5].map((mood) => (
                                <TouchableOpacity
                                    key={mood}
                                    style={[
                                        styles.moodCircle,
                                        { backgroundColor: getMoodColor(mood) },
                                        selectedMood === mood && styles.moodSelected
                                    ]}
                                    onPress={() => handleMoodSelect(mood)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.moodCircleEmoji}>{getMoodEmoji(mood)}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {selectedMood && (
                            <View style={styles.tagsSection}>
                                <Text style={styles.tagsLabel}>What influenced your mood?</Text>
                                <View style={styles.tagsContainer}>
                                    {tags.map((tag) => (
                                        <TouchableOpacity
                                            key={tag}
                                            style={[
                                                styles.tag,
                                                selectedTags.includes(tag) && styles.tagSelected
                                            ]}
                                            onPress={() => toggleTag(tag)}
                                        >
                                            <Text style={[
                                                styles.tagText,
                                                selectedTags.includes(tag) && styles.tagTextSelected
                                            ]}>{tag}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Weekly Overview */}
                    <View style={styles.card}>
                        <LinearGradient
                            colors={['rgba(139,92,246,0.15)', 'rgba(139,92,246,0.05)']}
                            style={styles.cardGradient}
                        />
                        <Text style={styles.cardTitle}>This Week</Text>
                        <Text style={styles.cardSubtitle}>Your mood at a glance</Text>

                        <View style={styles.weekRow}>
                            {MOCK_MOOD_DATA.map((item, index) => (
                                <View key={index} style={styles.dayColumn}>
                                    <View
                                        style={[
                                            styles.dayCircle,
                                            { backgroundColor: getMoodColor(item.mood) }
                                        ]}
                                    >
                                        <Text style={styles.dayEmoji}>{getMoodEmoji(item.mood)}</Text>
                                    </View>
                                    <Text style={styles.dayLabel}>{DAYS_OF_WEEK[item.day]}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Insights */}
                    <View style={styles.card}>
                        <LinearGradient
                            colors={['rgba(34,197,94,0.15)', 'rgba(34,197,94,0.05)']}
                            style={styles.cardGradient}
                        />
                        <Text style={styles.cardTitle}>💡 Insights</Text>

                        <View style={styles.insightItem}>
                            <Text style={styles.insightIcon}>📈</Text>
                            <View style={styles.insightContent}>
                                <Text style={styles.insightTitle}>Average Mood: 3.5/5</Text>
                                <Text style={styles.insightText}>You're doing well this week!</Text>
                            </View>
                        </View>

                        <View style={styles.insightItem}>
                            <Text style={styles.insightIcon}>🔥</Text>
                            <View style={styles.insightContent}>
                                <Text style={styles.insightTitle}>Best Day: Wednesday</Text>
                                <Text style={styles.insightText}>Mid-week seems to suit you well</Text>
                            </View>
                        </View>

                        <View style={styles.insightItem}>
                            <Text style={styles.insightIcon}>💪</Text>
                            <View style={styles.insightContent}>
                                <Text style={styles.insightTitle}>7 Day Streak</Text>
                                <Text style={styles.insightText}>You're building great habits!</Text>
                            </View>
                        </View>
                    </View>

                    {/* Add Entry Button */}
                    <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
                        <LinearGradient
                            colors={['#3B82F6', '#1D4ED8']}
                            style={styles.addButtonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        />
                        <Text style={styles.addButtonText}>+ Add Journal Entry</Text>
                    </TouchableOpacity>

                    <View style={{ height: 120 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A' },
    safeArea: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 20 },

    header: { marginBottom: 24 },
    headerTitle: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' },
    headerSubtitle: { color: '#94A3B8', fontSize: 14, marginTop: 4 },

    card: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    cardGradient: { ...StyleSheet.absoluteFillObject, borderRadius: 24 },
    cardTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginBottom: 4 },
    cardSubtitle: { color: '#94A3B8', fontSize: 14, marginBottom: 20 },

    moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
    moodCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'transparent',
    },
    moodSelected: { borderColor: '#FFFFFF', transform: [{ scale: 1.1 }] },
    moodCircleEmoji: { fontSize: 24 },

    tagsSection: { marginTop: 24 },
    tagsLabel: { color: '#94A3B8', fontSize: 14, marginBottom: 12 },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    tagSelected: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
    tagText: { color: '#94A3B8', fontSize: 14 },
    tagTextSelected: { color: '#FFFFFF' },

    weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
    dayColumn: { alignItems: 'center' },
    dayCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    dayEmoji: { fontSize: 18 },
    dayLabel: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },

    insightItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    insightIcon: { fontSize: 28, marginRight: 16 },
    insightContent: { flex: 1 },
    insightTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    insightText: { color: '#94A3B8', fontSize: 14, marginTop: 2 },

    addButton: {
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 8,
    },
    addButtonGradient: { paddingVertical: 16, alignItems: 'center' },
    addButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
