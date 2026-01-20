import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Send, AlertTriangle } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { chatService } from "../../services/chatService";
import { useAuth } from "../../context/AuthContext";
import { detectCrisis } from "../../utils/crisisDetection";
import CrisisModal from "../../components/CrisisModal";
import Nebula from "../../components/Nebula";

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
    isError?: boolean;
}

export default function ChatScreen() {
    const { user } = useAuth();
    // Use a fallback ID if user is not logged in (e.g. Guest)
    const userId = user?.id || "guest_user";

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hello! I'm Nila, your emotional wellness companion 🌙\n\nI'm here to listen without judgment. How are you feeling today?",
            sender: "ai",
            timestamp: new Date(),
        }
    ]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isCrisisModalVisible, setIsCrisisModalVisible] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const sendMessage = async () => {
        if (inputText.trim().length === 0 || isTyping) return;

        // Crisis Detection
        if (detectCrisis(inputText)) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setIsCrisisModalVisible(true);
            setInputText(""); // Clear input without sending
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        const userText = inputText.trim();
        const userMessage: Message = {
            id: Date.now().toString(),
            text: userText,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText("");
        setIsTyping(true);

        try {
            const responseText = await chatService.sendMessage(userText, userId);

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: "ai",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, aiResponse]);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Nila is sleeping right now (Network Error). Please try again later.",
                sender: "ai",
                timestamp: new Date(),
                isError: true,
            };
            setMessages(prev => [...prev, errorMessage]);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, [messages, isTyping]);

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.sender === "user";
        const isError = item.isError;
        return (
            <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
                {!isUser && (
                    <View style={[styles.aiAvatar, isError && styles.errorAvatar]}>
                        {isError ? <AlertTriangle size={16} color="#EF4444" /> : <Text style={styles.aiAvatarText}>🌙</Text>}
                    </View>
                )}
                <View style={[
                    styles.messageContent,
                    isUser ? styles.userContent : styles.aiContent,
                    isError && styles.errorContent
                ]}>
                    <Text style={[styles.messageText, isUser && styles.userText, isError && styles.errorText]}>{item.text}</Text>
                </View>
            </View>
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
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerAvatar}>
                        <LinearGradient
                            colors={['#3B82F6', '#8B5CF6']}
                            style={styles.avatarGradient}
                        />
                        <Text style={styles.avatarEmoji}>🌙</Text>
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle}>Nila</Text>
                        <View style={styles.statusRow}>
                            <View style={[styles.statusDot, isTyping && styles.statusDotTyping]} />
                            <Text style={styles.statusText}>{isTyping ? "Thinking..." : "Always here for you"}</Text>
                        </View>
                    </View>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                >
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={renderMessage}
                        style={styles.messagesList}
                        contentContainerStyle={styles.messagesContent}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={
                            isTyping ? (
                                <View style={styles.typingContainer}>
                                    <View style={styles.aiAvatar}>
                                        <Text style={styles.aiAvatarText}>🌙</Text>
                                    </View>
                                    <View style={styles.typingBubble}>
                                        <Nebula size={12} color="#A78BFA" />
                                    </View>
                                </View>
                            ) : null
                        }
                    />

                    {/* Input Area */}
                    <View style={styles.inputContainer}>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Share what's on your mind..."
                                placeholderTextColor="#64748B"
                                value={inputText}
                                onChangeText={setInputText}
                                multiline
                                maxLength={500}
                            />
                            <TouchableOpacity
                                onPress={sendMessage}
                                disabled={inputText.trim().length === 0 || isTyping}
                                style={[styles.sendButton, inputText.trim().length > 0 && !isTyping && styles.sendButtonActive]}
                            >
                                <Send {...{ size: 20, color: inputText.trim().length > 0 && !isTyping ? "white" : "#64748B" } as any} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.disclaimer}>Nila is an AI companion. For crisis support, please contact a helpline.</Text>
                    </View>
                </KeyboardAvoidingView>

                {/* Safety Modal */}
                <CrisisModal
                    visible={isCrisisModalVisible}
                    onClose={() => setIsCrisisModalVisible(false)}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0F172A' },
    safeArea: { flex: 1 },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    headerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    avatarGradient: { ...StyleSheet.absoluteFillObject },
    avatarEmoji: { fontSize: 24 },
    headerInfo: { flex: 1 },
    headerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
    statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E', marginRight: 6 },
    statusDotTyping: { backgroundColor: '#F59E0B' },
    statusText: { color: '#94A3B8', fontSize: 13 },

    keyboardView: { flex: 1 },
    messagesList: { flex: 1 },
    messagesContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },

    messageBubble: { flexDirection: 'row', marginBottom: 16, maxWidth: '85%' },
    userBubble: { alignSelf: 'flex-end' },
    aiBubble: { alignSelf: 'flex-start' },

    aiAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(167,139,250,0.2)', // Soft Lavender
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    errorAvatar: { backgroundColor: 'rgba(239,68,68,0.2)' },
    aiAvatarText: { fontSize: 16 },

    messageContent: {
        padding: 14,
        borderRadius: 20,
        maxWidth: '100%',
    },
    userContent: {
        backgroundColor: '#3B82F6',
        borderBottomRightRadius: 4,
    },
    aiContent: {
        backgroundColor: 'rgba(167,139,250,0.15)', // Soft Lavender per Design Brief
        borderBottomLeftRadius: 4,
    },
    errorContent: {
        backgroundColor: 'rgba(239,68,68,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.3)'
    },
    messageText: { color: '#E2E8F0', fontSize: 15, lineHeight: 22 },
    userText: { color: '#FFFFFF' },
    errorText: { color: '#FCA5A5' },

    typingContainer: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 },
    typingBubble: {
        backgroundColor: 'rgba(167,139,250,0.15)', // Soft Lavender
        padding: 14,
        borderRadius: 20,
        borderBottomLeftRadius: 4,
        minWidth: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },

    inputContainer: {
        padding: 16,
        paddingBottom: 100,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    textInput: {
        flex: 1,
        color: '#FFFFFF',
        fontSize: 16,
        maxHeight: 100,
        paddingVertical: 8,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginLeft: 8,
    },
    sendButtonActive: { backgroundColor: '#3B82F6' },

    disclaimer: {
        color: '#64748B',
        fontSize: 11,
        textAlign: 'center',
        marginTop: 12,
    },
});
