import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import { availabilityApi } from "../api/availabilityApi";

type Slot = {
    id: number;
    startTime: string;
    endTime: string;
    status: 'Open' | 'Booked';
};

const SetAvailabilityScreen = ({ setHeaderTitle }: { setHeaderTitle: (title: string) => void }) => {
    const [slots, setSlots] = useState<Slot[]>([
        { id: 1, startTime: '9:00 am', endTime: '10:00 am', status: 'Open' },
        { id: 2, startTime: '9:30 am', endTime: '10:30 am', status: 'Booked' },
    ]);

    const [selectedDate, setSelectedDate] = useState("2025-02-06");
    const [showModal, setShowModal] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const addSlot = async () => {
        if (!startTime || !endTime) return;

        const newSlot: Slot = {
            id: Date.now(),
            startTime: formatTime(startTime),
            endTime: formatTime(endTime),
            status: "Open"
        };

        await availabilityApi.addSlot(selectedDate, newSlot);
        await loadSlots(selectedDate);

        setSlots([...slots, newSlot]);
        setShowModal(false);
        setStartTime(null);
        setEndTime(null);
    }

    const deleteSlot = async (id: number) => {
        await availabilityApi.deleteSlot(selectedDate, id);
        await loadSlots(selectedDate);
    }
    useEffect(() => {
        setHeaderTitle("Availability");
        loadSlots(selectedDate);
    }, []);

    const loadSlots = async (date: string) => {
        const data = await availabilityApi.getSlots(date);
        setSlots(data);
    };

    const formatDisplayDate = (date: string) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.pageTitle}>Set Availability</Text>

            {/* Calendar */}
            <View style={styles.calendarCard}>
                <Calendar
                    current={selectedDate}
                    onDayPress={(day) => setSelectedDate(day.dateString)}
                    markedDates={{
                        [selectedDate]: {
                            selected: true,
                            selectedColor: "#23B04B",
                            selectedTextColor: "#fff",
                        },
                    }}
                    theme={{
                        todayTextColor: "#23B04B",
                        arrowColor: "#23B04B",
                        monthTextColor: "#333",
                        textMonthFontWeight: "500",
                        textSectionTitleColor: "#999",
                    }}
                />
            </View>

            {/* Selected Date */}
            <Text style={styles.dateTitle}>{formatDisplayDate(selectedDate)}</Text>

            {/* Time Slots */}
            {slots.map((slot) => (
                <View key={slot.id} style={styles.slotRow}>
                    <View style={styles.timeBox}>
                        <Text style={styles.timeText}>{slot.startTime}</Text>
                        <Icon name="chevron-down-outline" size={14} color="#444" />
                    </View>
                    <Text style={styles.dash}>—</Text>
                    <View style={styles.timeBox}>
                        <Text style={styles.timeText}>{slot.endTime}</Text>
                        <Icon name="chevron-down-outline" size={14} color="#444" />
                    </View>

                    <View
                        style={[
                            styles.statusBox,
                            slot.status === "Open"
                                ? styles.openStatus
                                : styles.bookedStatus,
                        ]}
                    >
                        <Text
                            style={[
                                styles.statusText,
                                slot.status === "Open"
                                    ? styles.openText
                                    : styles.bookedText,
                            ]}
                        >
                            {slot.status}
                        </Text>
                    </View>

                    <TouchableOpacity onPress={() => deleteSlot(slot.id)}>
                        <Icon name="trash-outline" size={22} color="#ff3b30" />
                    </TouchableOpacity>
                </View>
            ))}

            {/* Add Slot Button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowModal(true)}
            >
                <Icon name="add" size={26} color="#fff" />
            </TouchableOpacity>

            {/* Modal */}
            <Modal transparent visible={showModal} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Add New Slot</Text>

                        {/* Start Time */}
                        <Pressable
                            style={styles.timePickerButton}
                            onPress={() => setShowStartPicker(true)}
                        >
                            <Text>
                                {startTime ? formatTime(startTime) : "Select Start Time"}
                            </Text>
                        </Pressable>

                        {/* End Time */}
                        <Pressable
                            style={styles.timePickerButton}
                            onPress={() => setShowEndPicker(true)}
                        >
                            <Text>
                                {endTime ? formatTime(endTime) : "Select End Time"}
                            </Text>
                        </Pressable>

                        {showStartPicker && (
                            <DateTimePicker
                                mode="time"
                                value={new Date()}
                                onChange={(e: any, selectedDate: any) => {
                                    setShowStartPicker(false);
                                    if (selectedDate) setStartTime(selectedDate);
                                }}
                            />
                        )}

                        {showEndPicker && (
                            <DateTimePicker
                                mode="time"
                                value={new Date()}
                                onChange={(e: any, selectedDate: any) => {
                                    setShowEndPicker(false);
                                    if (selectedDate) setEndTime(selectedDate);
                                }}
                            />
                        )}

                        {/* Modal Buttons */}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                                onPress={() => setShowModal(false)}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: "#23B04B" }]}
                                onPress={addSlot}
                            >
                                <Text style={{ color: "#fff" }}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    pageTitle: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        marginVertical: 20,
    },
    calendarCard: {
        backgroundColor: "#fff",
        borderRadius: 10,
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    dateTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginLeft: 25,
        marginTop: 25,
        marginBottom: 15,
    },
    slotRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginBottom: 12,
    },
    timeBox: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: 100,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    timeText: { color: "#333", fontSize: 14 },
    dash: { fontSize: 18, color: "#444" },
    statusBox: {
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 10,
        minWidth: 70,
        alignItems: "center",
    },
    openStatus: { backgroundColor: "#CBF9D7" },
    bookedStatus: { backgroundColor: "#FFECCD" },
    statusText: { fontWeight: "600", fontSize: 13 },
    openText: { color: "#10B981" },
    bookedText: { color: "#F59E0B" },
    addButton: {
        backgroundColor: "#23B04B",
        alignSelf: "center",
        borderRadius: 25,
        padding: 8,
        marginTop: 25,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        backgroundColor: "#fff",
        borderRadius: 10,
        width: "80%",
        padding: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 15,
    },
    timePickerButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        marginVertical: 8,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
    },
    modalBtn: {
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
});

export default SetAvailabilityScreen;