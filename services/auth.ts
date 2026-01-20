import * as Crypto from 'expo-crypto';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = 'nila_user_id';
const NICKNAME_KEY = 'nila_nickname';

const NICKNAMES = [
    "Cosmic Traveler",
    "Silent Warrior",
    "Moonlight Dreamer",
    "Stardust Soul",
    "Peaceful Voyager",
    "Ocean Calm",
    "Mountain Strength",
    "Quiet River",
    "Serene Spirit",
    "Gentle Breeze"
];

export const auth = {
    async getUserId(): Promise<string> {
        try {
            let id = await AsyncStorage.getItem(USER_ID_KEY);
            if (!id) {
                id = Crypto.randomUUID();
                await AsyncStorage.setItem(USER_ID_KEY, id);
            }
            return id;
        } catch (e) {
            console.error('Auth UserID Error', e);
            return 'guest-user';
        }
    },

    async getNickname(): Promise<string> {
        try {
            let name = await AsyncStorage.getItem(NICKNAME_KEY);
            if (!name) {
                name = this.generateNickname();
                await AsyncStorage.setItem(NICKNAME_KEY, name);
            }
            return name;
        } catch (e) {
            return "Cosmic Traveler";
        }
    },

    async setNickname(name: string): Promise<void> {
        await AsyncStorage.setItem(NICKNAME_KEY, name);
    },

    generateNickname(): string {
        const randomIndex = Math.floor(Math.random() * NICKNAMES.length);
        return NICKNAMES[randomIndex];
    },

    async isBiometricAvailable(): Promise<boolean> {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            return hasHardware && isEnrolled;
        } catch (e) {
            return false;
        }
    },

    async authenticate(): Promise<boolean> {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock Nila',
                fallbackLabel: 'Enter Passcode',
                disableDeviceFallback: false,
                cancelLabel: 'Cancel',
            });
            return result.success;
        } catch (e) {
            console.error('Biometric Auth Error', e);
            return false;
        }
    }
};
