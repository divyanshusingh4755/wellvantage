import React, { useEffect, useState } from "react";
import { workoutApi, Workout, Day as ApiDay, Exercise as ApiExercise } from "../api/workoutApi";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

interface Exercise {
    name: string,
    sets: string,
    reps: string
}

interface Day {
    name: string,
    exercises: Exercise[]
}

const AddWorkoutScreen = ({ onClose }: { onClose: () => void }) => {
    const navigation = useNavigation();
    const [workoutName, setWorkoutName] = useState('Beginner’s Workout - 3 Days');
    const [days, setDays] = useState<Day[]>([
        {
            name: "Chest",
            exercises: [
                { name: "Chest", sets: "10", reps: "5–8" },
                { name: "Bench Press", sets: "8", reps: "3" },
                { name: "Planks", sets: "3", reps: "30 secs" },
            ],
        },
    ]);
    const [note, setNote] = useState("");

    const MAX_WORDS = 50;
    const wordCount = note.trim().split(/\+s/).filter(Boolean).length;
    const remaininWords = MAX_WORDS - wordCount;

    useEffect(() => {
        const loadWorkout = async () => {
            const all = await workoutApi.getAllWorkouts();
            if (all.length) {
                const first = all[0];
                setWorkoutName(first.name);
                setDays(first.days.map(d => ({
                    name: d.name,
                    exercises: d.exercises.map(e => ({
                        name: e.name,
                        sets: e.sets,
                        reps: e.reps
                    }))
                })));
                setNote(first.note || '');
            }
        };
        loadWorkout();
    }, []);

    const addDay = async () => {
        const newDay: Day = { name: "", exercises: [{ name: "", sets: "", reps: "" }] };
        setDays([...days, newDay]);
    }

    const updateDayName = (index: number, value: string) => {
        const updated = [...days];
        updated[index].name = value;
        setDays(updated);
    }

    const deleteDay = (index: number) => {
        setDays(days.filter((_, i) => i !== index));
    }


    const addExercise = (dayIndex: number) => {
        const updated = [...days];
        updated[dayIndex].exercises.push({ name: "", sets: "", reps: "" });
        setDays(updated);
    }

    const updateExercise = (dayIndex: number, exIndex: number, field: keyof Exercise, value: string) => {
        const updated = [...days];
        updated[dayIndex].exercises[exIndex][field] = value;
        setDays(updated);
    }

    const deleteExercise = (dayIndex: number, exIndex: number) => {
        const updated = [...days];
        updated[dayIndex].exercises = updated[dayIndex].exercises.filter((_, i) => i !== exIndex);
        setDays(updated);
    }

    const handleSubmit = async () => {
        const newWorkout: Omit<Workout, "id"> = {
            name: workoutName,
            days: days.map(d => ({
                id: Date.now(),
                name: d.name,
                exercises: d.exercises.map((e) => ({ id: Date.now(), ...e }))
            })),
            note,
        };

        await workoutApi.addWorkout(newWorkout);
        alert("Workout saved successfully!");
        onClose?.();
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
                {/* Workout Info */}
                <TextInput
                    style={styles.workoutInput}
                    placeholder="Workout Plan Name"
                    value={workoutName}
                    onChangeText={setWorkoutName}
                />

                {/* Day List */}
                {days.map((day, dayIndex) => (
                    <View key={dayIndex}>
                        {/* Day Header */}
                        <View style={styles.dayContainer}>
                            <View style={styles.dayLabel}>
                                <Text style={styles.dayText}>Day {dayIndex + 1}</Text>
                            </View>
                            <TextInput
                                style={styles.dayInput}
                                value={day.name}
                                onChangeText={(v) => updateDayName(dayIndex, v)}
                                placeholder="Body Part (e.g., Chest)"
                            />

                            <TouchableOpacity onPress={() => deleteDay(dayIndex)}>
                                <Icon name="trash-outline" size={33} color="#ff0000" />
                            </TouchableOpacity>
                        </View>
                        {/* Add Exercise Button */}
                        <TouchableOpacity onPress={() => addExercise(dayIndex)} style={styles.addSmallButton}>
                            <Icon name="add" size={24} color="#fff" />
                        </TouchableOpacity>

                        {/* Exercise List */}
                        <View style={styles.exerciseHeader}>
                            <Text style={[styles.exerciseHeaderText, { flex: 2 }]}>Exercise</Text>
                            <Text style={[styles.exerciseHeaderText, { flex: 1 }]}>Sets</Text>
                            <Text style={[styles.exerciseHeaderText, { flex: 1 }]}>Reps</Text>
                        </View>

                        {day.exercises.map((ex, exIndex) => (
                            <View key={exIndex} style={styles.exerciseRow}>
                                <TextInput
                                    style={[styles.exerciseInput, { flex: 2 }]}
                                    placeholder="Exercise"
                                    value={ex.name}
                                    onChangeText={(v) => updateExercise(dayIndex, exIndex, "name", v)}
                                />
                                <TextInput
                                    style={[styles.exerciseInput, { flex: 2 }]}
                                    placeholder="Sets"
                                    value={ex.sets}
                                    onChangeText={(v) => updateExercise(dayIndex, exIndex, "sets", v)}
                                    keyboardType="numeric"
                                />
                                <TextInput
                                    style={[styles.exerciseInput, { flex: 2 }]}
                                    placeholder="Reps"
                                    value={ex.reps}
                                    onChangeText={(v) => updateExercise(dayIndex, exIndex, "reps", v)}
                                    keyboardType="numeric"
                                />
                                <TouchableOpacity onPress={() => deleteExercise(dayIndex, exIndex)}>
                                    <Icon name="trash-outline" size={22} color="#ff0000" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                ))}

                {/* Add more exercise Button */}
                <TouchableOpacity onPress={addDay} style={styles.addButton}>
                    <Icon name="add" size={37} color="#fff" />
                </TouchableOpacity>

                {/* Notes Section */}
                <TextInput
                    style={styles.noteInput}
                    placeholder="Add Notes for instructions..."
                    value={note}
                    onChangeText={setNote}
                    multiline
                    maxLength={MAX_WORDS * 10}
                />
                <Text style={styles.wordCount}>{remaininWords} Words remaining</Text>

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    workoutInput: {
        marginTop: 30,
        marginHorizontal: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#fff",
        elevation: 2,
    },
    dayContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 20,
        marginBottom: 10,
    },
    dayLabel: {
        backgroundColor: "#28a745",
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
        paddingVertical: 6,
        paddingHorizontal: 15,
        fontSize: 28,
        fontWeight: '600',
        lineHeight: 25
    },
    dayText: {
        lineHeight: 25,
        fontSize: 18,
        color: "#fff",
        fontWeight: "600"
    },
    dayInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        color: '#737373',
        borderRadius: 8,
        marginLeft: 3,
        marginRight: 5,
        padding: 10,
        fontSize: 18,
        lineHeight: 28,
        fontWeight: '500',
    },
    addSmallButton: {
        backgroundColor: "#28a745",
        alignSelf: "center",
        width: 32,
        height: 32,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15
    },
    exerciseHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginTop: 30,
    },
    exerciseHeaderText: {
        fontWeight: "700",
        color: "#333",
        fontSize: 16
    },
    exerciseRow: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 20,
        marginVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingBottom: 6,
    },
    exerciseInput: {
        borderWidth: 1,
        borderColor: "#28a745",
        borderRadius: 6,
        padding: 8,
        marginRight: 5,
        fontSize: 15,
    },
    addButton: {
        backgroundColor: "#28a745",
        alignSelf: "center",
        width: 45,
        height: 45,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20
    },
    noteInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        marginHorizontal: 20,
        marginTop: 30,
        padding: 12,
        height: 100,
        textAlignVertical: "top",
    },
    wordCount: {
        textAlign: "right",
        marginRight: 30,
        color: "orange",
        marginTop: 5,
    },
    submitButton: {
        backgroundColor: "#28a745",
        marginHorizontal: 20,
        marginVertical: 30,
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: "center"
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700"
    },
})

export default AddWorkoutScreen;