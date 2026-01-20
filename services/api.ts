import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Infer API URL based on platform
// Android Emulator uses 10.0.2.2 for localhost
// iOS Simulator uses localhost
const getBaseUrl = () => {
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:8000';
    }
    return 'http://localhost:8000';
};

const API_URL = getBaseUrl();
const CHAT_STORAGE_KEY = 'nila_chat_history';

export interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
}

export const api = {
    async sendMessageToAI(text: string): Promise<string> {
        try {
            console.log(`Sending message to ${API_URL}/chat`);
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: text }),
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data.response || "I hear you.";
        } catch (error) {
            console.error('API Call Failed:', error);
            // Fallback response for demo/offline
            return "I'm having trouble connecting to my brain right now, but I'm still here listening.";
        }
    },

    async saveChatHistory(messages: Message[]) {
        try {
            const jsonValue = JSON.stringify(messages);
            await AsyncStorage.setItem(CHAT_STORAGE_KEY, jsonValue);
        } catch (e) {
            console.error('Failed to save chat history', e);
        }
    },

    async getChatHistory(): Promise<Message[]> {
        try {
            const jsonValue = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
            if (jsonValue != null) {
                const parsed = JSON.parse(jsonValue);
                // Restore Date objects
                return parsed.map((m: any) => ({
                    ...m,
                    timestamp: new Date(m.timestamp)
                }));
            }
            return [];
        } catch (e) {
            console.error('Failed to load chat history', e);
            return [];
        }
    }
};
