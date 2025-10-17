import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import WorkoutManagementScreen from "./WorkoutManagementScreen";
import ClientScreen from "./ClientScreen";
import SetAvailabilityScreen from "./SetAvailabilityScreen";

const MainScreen = () => {
    const [activeTab, setActiveTab] = useState<"Workout" | "Client" | "Availability">("Workout");
    const [headerTitle, setHeaderTitle] = useState<string>("Workout");

    const renderContent = () => {
        switch (activeTab) {
            case "Workout":
                return <WorkoutManagementScreen setHeaderTitle={setHeaderTitle} />;
            case "Client":
                return <ClientScreen setHeaderTitle={setHeaderTitle} />
            case "Availability":
                return (<SetAvailabilityScreen setHeaderTitle={setHeaderTitle}/>);
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Icon name="menu" size={30} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{headerTitle}</Text>
                <TouchableOpacity>
                    <Icon name="refresh" size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabBar}>
                {["Workout", "Client", "Availability"].map((tab) => (
                    <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as any)}>
                        <Text
                            style={[
                                styles.tab,
                                activeTab === tab && styles.tabActive,
                            ]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Screen Content */}
            <View style={styles.contentContainer}>{renderContent()}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#28a745",
        paddingTop: 60,
        paddingHorizontal: 15,
        paddingBottom: 20,
        elevation: 5,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "600",
    },
    tabBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginTop: 30,
    },
    tabActive: {
        color: "#28a745",
        fontWeight: "600",
        borderBottomWidth: 2,
        borderBottomColor: "#28a745",
        paddingBottom: 5,
        fontSize: 18,
    },
    tab: {
        color: "#000",
        fontSize: 18,
        paddingBottom: 5,
    },
    contentContainer: {
        flex: 1,
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        fontSize: 18,
        color: "#888",
        textAlign: "center",
        paddingHorizontal: 20,
    },
});

export default MainScreen;
