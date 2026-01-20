
import { Platform } from 'react-native';

// For physical device: use your computer's IP address
// For emulator: Android uses 10.0.2.2, iOS uses localhost
const getBaseUrl = () => {
    // Use your machine's LAN IP for physical devices
    // Both phone and computer must be on the same WiFi network
    const LAN_IP = '192.168.20.210';

    return `http://${LAN_IP}:8000`;
};

const API_URL = getBaseUrl();

export interface ChatResponse {
    response: string;
    // Add other fields if backend returns them, e.g., memory_updated: boolean
}

const FALLBACK_RESPONSES = [
    "I hear you, and I'm glad you're sharing with me. How long have you been feeling this way?",
    "That sounds challenging. Remember, it's okay to take things one moment at a time. 🌙",
    "I'm here for you. Would you like to talk more about what's on your mind?",
    "Your feelings are valid. Sometimes just naming what we feel can bring a bit of relief.",
    "Thank you for trusting me with this. Let's take a deep breath together. 💙",
];

export const chatService = {
    async sendMessage(text: string, userId: string): Promise<string> {
        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text,
                    user_id: userId,
                }),
            });

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            const data: ChatResponse = await response.json();

            // If backend returns error message, use fallback
            if (data.response.includes("sleeping") || data.response.includes("Error")) {
                return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
            }

            return data.response;
        } catch (error) {
            // Silently fail to fallback response
            // Return a fallback response instead of throwing
            return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
        }
    }
};
