import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/context/AuthContext";
import { router } from "expo-router";

export default function ProfileScreen() {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    await logout();
                    router.replace("/login");
                },
            },
        ]);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header with Gradient */}
            <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.header}
            >
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                </View>
                <Text style={styles.name}>{user?.name}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </LinearGradient>

            {/* Profile Info Cards */}
            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Information</Text>

                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <Ionicons
                                    name="person-outline"
                                    size={20}
                                    color="#667eea"
                                />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>Full Name</Text>
                                <Text style={styles.infoValue}>
                                    {user?.name}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color="#667eea"
                                />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>
                                    Email Address
                                </Text>
                                <Text style={styles.infoValue}>
                                    {user?.email}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <Ionicons
                                    name="calendar-outline"
                                    size={20}
                                    color="#667eea"
                                />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>
                                    Member Since
                                </Text>
                                <Text style={styles.infoValue}>
                                    {formatDate(user?.created_at)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoRow}>
                            <View style={styles.infoIcon}>
                                <Ionicons
                                    name="finger-print-outline"
                                    size={20}
                                    color="#667eea"
                                />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoLabel}>User ID</Text>
                                <Text style={styles.infoValue}>{user?.id}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Settings Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons
                                name="notifications-outline"
                                size={24}
                                color="#667eea"
                            />
                            <Text style={styles.settingText}>
                                Notifications
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={24}
                            color="#999"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={24}
                                color="#667eea"
                            />
                            <Text style={styles.settingText}>Privacy</Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={24}
                            color="#999"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons
                                name="help-circle-outline"
                                size={24}
                                color="#667eea"
                            />
                            <Text style={styles.settingText}>
                                Help & Support
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={24}
                            color="#999"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons
                                name="information-circle-outline"
                                size={24}
                                color="#667eea"
                            />
                            <Text style={styles.settingText}>About</Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={24}
                            color="#999"
                        />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={24} color="white" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                {/* App Version */}
                <Text style={styles.version}>Version 1.0.0</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        paddingTop: 60,
        paddingBottom: 40,
        alignItems: "center",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    avatarContainer: {
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#667eea",
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.9)",
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginBottom: 15,
    },
    infoCard: {
        backgroundColor: "white",
        borderRadius: 15,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: "#999",
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    divider: {
        height: 1,
        backgroundColor: "#f0f0f0",
        marginVertical: 5,
    },
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    settingLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    settingText: {
        fontSize: 16,
        color: "#333",
        marginLeft: 15,
        fontWeight: "500",
    },
    logoutButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f44336",
        padding: 16,
        borderRadius: 12,
        marginTop: 10,
        shadowColor: "#f44336",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    logoutText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 10,
    },
    version: {
        textAlign: "center",
        color: "#999",
        fontSize: 12,
        marginTop: 20,
        marginBottom: 10,
    },
});
