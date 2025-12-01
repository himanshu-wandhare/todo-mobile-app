import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = await AsyncStorage.getItem("authToken");
            const userData = await AsyncStorage.getItem("userData");

            if (token && userData) {
                setUser(JSON.parse(userData));
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Error checking auth status:", error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);

            await AsyncStorage.setItem("authToken", response.access_token);
            await AsyncStorage.setItem(
                "userData",
                JSON.stringify(response.user)
            );

            setUser(response.user);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                message: error.response?.data?.detail || "Login failed",
            };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const response = await authAPI.signup(name, email, password);

            await AsyncStorage.setItem("authToken", response.access_token);
            await AsyncStorage.setItem(
                "userData",
                JSON.stringify(response.user)
            );

            setUser(response.user);
            setIsAuthenticated(true);

            return { success: true };
        } catch (error) {
            console.error("Signup error:", error);
            return {
                success: false,
                message: error.response?.data?.detail || "Signup failed",
            };
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.multiRemove(["authToken", "userData"]);
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const refreshProfile = async () => {
        try {
            const profile = await authAPI.getProfile();
            await AsyncStorage.setItem("userData", JSON.stringify(profile));
            setUser(profile);
        } catch (error) {
            console.error("Error refreshing profile:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                login,
                signup,
                logout,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
