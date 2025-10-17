import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import AddWorkoutScreen from "./AddWorkoutScreen";
import { workoutManagementApi, WorkoutPlan } from "../api/workoutManagementApi";

const WorkoutManagementScreen = ({ setHeaderTitle }: { setHeaderTitle: (title: string) => void }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string>("");
    const [showAddWorkout, setShowAddWorkout] = useState(false);
    const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);

    const loadPlans = async () => {
        const plans = await workoutManagementApi.getAllPlans();
        setWorkoutPlans(plans);
        if (!selectedPlan && plans.length > 0) setSelectedPlan(plans[0].name);
    };

    const handleSelectPlan = (plan: string) => {
        setSelectedPlan(plan);
        setShowDropdown(false);
    };

    useEffect(() => {
        loadPlans();
    }, []);

    useEffect(() => {
        setHeaderTitle(showAddWorkout ? "Add Workout" : "Workout");
    }, [showAddWorkout]);


    if (showAddWorkout) {
        return <AddWorkoutScreen onClose={() => {
            setShowAddWorkout(false);
            loadPlans();
        }} />;
    }

    const handleDeletePlan = async (id: number) => {
        await workoutManagementApi.deletePlan(id);
        setWorkoutPlans(prev => prev.filter(p => p.id !== id));
        if (selectedPlan === workoutPlans.find(p => p.id === id)?.name && workoutPlans.length > 1) {
            setSelectedPlan(workoutPlans[0].name);
        }
    };

    return (
        <View style={styles.container}>
            {/* Dropdown */}
            <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowDropdown(true)}
                activeOpacity={0.8}
            >
                <Text style={styles.dropdownText}>{selectedPlan || "Select a Plan"}</Text>
                <Icon name="chevron-down" size={20} color="#333" />
            </TouchableOpacity>

            {/* Modal Dropdown */}
            <Modal
                transparent={true}
                visible={showDropdown}
                animationType="fade"
                onRequestClose={() => setShowDropdown(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>

                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Select a Plan</Text>
                    <ScrollView>
                        {workoutPlans.map((plan) => (
                            <TouchableOpacity
                                key={plan.id}
                                style={styles.modalItem}
                                onPress={() => handleSelectPlan(plan.name)}
                            >
                                <Text style={styles.modalItemText}>{plan.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Modal>

            {/* Workout items */}
            <ScrollView style={{ flex: 1 }}>
                {workoutPlans.map(plan => (
                    <View key={plan.id} style={styles.workoutItem}>
                        <Text style={styles.workoutText}>{plan.name}</Text>
                        <TouchableOpacity onPress={() => handleDeletePlan(plan.id)}>
                            <Icon name="trash-outline" size={27} color="#ff0000" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Floating Add Button */}
            <View style={styles.addButtonContainer}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowAddWorkout(true)}
                >
                    <Icon name="add" size={37} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginHorizontal: 20,
        marginTop: 100,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        elevation: 3,
    },
    dropdownText: {
        fontSize: 17,
        color: '#333',
        fontWeight: '500',
    },
    dropdownList: {
        marginHorizontal: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#fff",
        elevation: 3,
        marginBottom: 20,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    dropdownItemText: { fontSize: 16, color: "#333" },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    modalContainer: {
        position: "absolute",
        top: "35%",
        left: "10%",
        right: "10%",
        backgroundColor: "#fff",
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 15,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#28a745",
        marginBottom: 10,
        textAlign: "center",
    },
    modalItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    modalItemText: { fontSize: 16, color: "#333", textAlign: "center" },
    workoutItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        margin: 15
    },
    workoutText: {
        fontSize: 18,
        color: '#333',
        fontWeight: '500'
    },
    addButtonContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40
    },
    addButton: {
        backgroundColor: '#28a745',
        width: 45,
        height: 45,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
});

export default WorkoutManagementScreen;
