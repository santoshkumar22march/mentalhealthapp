import { Tabs } from "expo-router";
import { View } from "react-native";
import { BlurView } from "expo-blur";
import { Home, MessageCircle, BookOpen, Wind } from "lucide-react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: 20,
                    left: 20,
                    right: 20,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: "transparent",
                    elevation: 0,
                },
                tabBarBackground: () => (
                    <BlurView
                        intensity={80}
                        tint="dark"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            borderRadius: 30,
                            overflow: "hidden",
                        }}
                    />
                ),
                tabBarShowLabel: false,
                tabBarActiveTintColor: "#60A5FA",
                tabBarInactiveTintColor: "#94A3B8",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color }) => <Home color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <View
                            className={`p-3 rounded-full ${focused ? "bg-blue-400/20" : "bg-transparent"
                                }`}
                        >
                            <MessageCircle color={color} size={24} fill={focused ? color : "none"} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="journal"
                options={{
                    tabBarIcon: ({ color }) => <BookOpen color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="calm"
                options={{
                    tabBarIcon: ({ color }) => <Wind color={color} size={24} />,
                }}
            />
        </Tabs>
    );
}
