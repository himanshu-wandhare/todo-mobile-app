import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Configure backend URL here
const API_BASE_URL = "http://192.168.1.2:8000"; // Change to your local IP
// For iOS simulator: http://localhost:8000
// For Android emulator: http://10.0.2.2:8000
// For physical device: http://YOUR_LOCAL_IP:8000

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await AsyncStorage.multiRemove(["authToken", "userData"]);
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    signup: async (name, email, password) => {
        const response = await api.post("/api/auth/signup", {
            name,
            email,
            password,
        });
        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post("/api/auth/login", {
            email,
            password,
        });
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get("/api/user/profile");
        return response.data;
    },
};

export const todoAPI = {
    getTodos: async (status = null) => {
        const params = status ? { status } : {};
        const response = await api.get("/api/todos", { params });
        return response.data;
    },

    getTodoById: async (id) => {
        const response = await api.get(`/api/todos/${id}`);
        return response.data;
    },

    createTodo: async (title, description = "") => {
        const response = await api.post("/api/todos", {
            title,
            description,
        });
        return response.data;
    },

    updateTodo: async (id, data) => {
        const response = await api.put(`/api/todos/${id}`, data);
        return response.data;
    },

    deleteTodo: async (id) => {
        await api.delete(`/api/todos/${id}`);
    },

    getStats: async () => {
        const response = await api.get("/api/todos/stats/summary");
        return response.data;
    },
};

export default api;
