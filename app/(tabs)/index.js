import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert,
    TextInput,
    Modal,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { todoAPI } from "../../src/services/api";
import { useAuth } from "../../src/context/AuthContext";

export default function DashboardScreen() {
    const [todos, setTodos] = useState([]);
    const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [newTodoTitle, setNewTodoTitle] = useState("");
    const [newTodoDescription, setNewTodoDescription] = useState("");
    const [filter, setFilter] = useState("all"); // all, pending, completed
    const { user } = useAuth();

    useEffect(() => {
        fetchTodos();
        fetchStats();
    }, [filter]);

    const fetchTodos = async () => {
        try {
            const status = filter === "all" ? null : filter;
            const data = await todoAPI.getTodos(status);
            setTodos(data);
        } catch (error) {
            console.error("Error fetching todos:", error);
            Alert.alert("Error", "Failed to fetch todos");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await todoAPI.getStats();
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchTodos();
        fetchStats();
    }, [filter]);

    const handleCreateTodo = async () => {
        if (!newTodoTitle.trim()) {
            Alert.alert("Error", "Please enter a title");
            return;
        }

        try {
            await todoAPI.createTodo(newTodoTitle, newTodoDescription);
            setNewTodoTitle("");
            setNewTodoDescription("");
            setModalVisible(false);
            fetchTodos();
            fetchStats();
            Alert.alert("Success", "Todo created successfully");
        } catch (error) {
            console.error("Error creating todo:", error);
            Alert.alert("Error", "Failed to create todo");
        }
    };

    const handleToggleComplete = async (todo) => {
        try {
            const newStatus =
                todo.status === "completed" ? "pending" : "completed";
            await todoAPI.updateTodo(todo.id, { status: newStatus });
            fetchTodos();
            fetchStats();
        } catch (error) {
            console.error("Error updating todo:", error);
            Alert.alert("Error", "Failed to update todo");
        }
    };

    const handleDeleteTodo = async (id) => {
        Alert.alert(
            "Delete Todo",
            "Are you sure you want to delete this todo?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await todoAPI.deleteTodo(id);
                            fetchTodos();
                            fetchStats();
                        } catch (error) {
                            console.error("Error deleting todo:", error);
                            Alert.alert("Error", "Failed to delete todo");
                        }
                    },
                },
            ]
        );
    };

    const renderTodoItem = ({ item }) => (
        <View style={styles.todoItem}>
            <TouchableOpacity
                onPress={() => handleToggleComplete(item)}
                style={styles.checkboxContainer}
            >
                <Ionicons
                    name={
                        item.status === "completed"
                            ? "checkmark-circle"
                            : "ellipse-outline"
                    }
                    size={28}
                    color={item.status === "completed" ? "#4CAF50" : "#999"}
                />
            </TouchableOpacity>

            <View style={styles.todoContent}>
                <Text
                    style={[
                        styles.todoTitle,
                        item.status === "completed" && styles.completedText,
                    ]}
                >
                    {item.title}
                </Text>
                {item.description ? (
                    <Text style={styles.todoDescription} numberOfLines={2}>
                        {item.description}
                    </Text>
                ) : null}
                <Text style={styles.todoDate}>
                    {new Date(item.created_at).toLocaleDateString()}
                </Text>
            </View>

            <TouchableOpacity
                onPress={() => handleDeleteTodo(item.id)}
                style={styles.deleteButton}
            >
                <Ionicons name="trash-outline" size={20} color="#f44336" />
            </TouchableOpacity>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No todos yet</Text>
            <Text style={styles.emptySubtext}>
                Tap the + button to create your first todo
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#667eea" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {user?.name}!</Text>
                    <Text style={styles.subtitle}>
                        Let's be productive today
                    </Text>
                </View>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
                <View style={[styles.statCard, { backgroundColor: "#667eea" }]}>
                    <Text style={styles.statNumber}>{stats.total}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: "#4CAF50" }]}>
                    <Text style={styles.statNumber}>{stats.completed}</Text>
                    <Text style={styles.statLabel}>Completed</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: "#FF9800" }]}>
                    <Text style={styles.statNumber}>{stats.pending}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[
                        styles.filterTab,
                        filter === "all" && styles.activeFilter,
                    ]}
                    onPress={() => setFilter("all")}
                >
                    <Text
                        style={[
                            styles.filterText,
                            filter === "all" && styles.activeFilterText,
                        ]}
                    >
                        All
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.filterTab,
                        filter === "pending" && styles.activeFilter,
                    ]}
                    onPress={() => setFilter("pending")}
                >
                    <Text
                        style={[
                            styles.filterText,
                            filter === "pending" && styles.activeFilterText,
                        ]}
                    >
                        Pending
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.filterTab,
                        filter === "completed" && styles.activeFilter,
                    ]}
                    onPress={() => setFilter("completed")}
                >
                    <Text
                        style={[
                            styles.filterText,
                            filter === "completed" && styles.activeFilterText,
                        ]}
                    >
                        Completed
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Todo List */}
            <FlatList
                data={todos}
                renderItem={renderTodoItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />

            {/* Add Button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setModalVisible(true)}
            >
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>

            {/* Create Todo Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                Create New Todo
                            </Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                            >
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="Title"
                            value={newTodoTitle}
                            onChangeText={setNewTodoTitle}
                            autoFocus
                        />

                        <TextInput
                            style={[styles.modalInput, styles.modalTextArea]}
                            placeholder="Description (optional)"
                            value={newTodoDescription}
                            onChangeText={setNewTodoDescription}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />

                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={handleCreateTodo}
                        >
                            <Text style={styles.createButtonText}>
                                Create Todo
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        backgroundColor: "white",
        padding: 20,
        paddingTop: 60,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    greeting: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginTop: 5,
    },
    statsContainer: {
        flexDirection: "row",
        padding: 20,
        gap: 10,
    },
    statCard: {
        flex: 1,
        padding: 15,
        borderRadius: 15,
        alignItems: "center",
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    statLabel: {
        fontSize: 12,
        color: "white",
        marginTop: 5,
    },
    filterContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        marginBottom: 10,
        gap: 10,
    },
    filterTab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: "white",
        alignItems: "center",
    },
    activeFilter: {
        backgroundColor: "#667eea",
    },
    filterText: {
        fontSize: 14,
        color: "#666",
        fontWeight: "500",
    },
    activeFilterText: {
        color: "white",
    },
    listContent: {
        padding: 20,
        flexGrow: 1,
    },
    todoItem: {
        flexDirection: "row",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    checkboxContainer: {
        marginRight: 12,
    },
    todoContent: {
        flex: 1,
    },
    todoTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    completedText: {
        textDecorationLine: "line-through",
        color: "#999",
    },
    todoDescription: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
    todoDate: {
        fontSize: 12,
        color: "#999",
        marginTop: 6,
    },
    deleteButton: {
        padding: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#999",
        marginTop: 20,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#ccc",
        marginTop: 8,
        textAlign: "center",
    },
    addButton: {
        position: "absolute",
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#667eea",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#667eea",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "white",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 25,
        minHeight: 300,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    modalInput: {
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        marginBottom: 15,
    },
    modalTextArea: {
        height: 100,
    },
    createButton: {
        backgroundColor: "#667eea",
        borderRadius: 12,
        padding: 15,
        alignItems: "center",
        marginTop: 10,
    },
    createButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});
