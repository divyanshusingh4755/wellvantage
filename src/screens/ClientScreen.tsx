import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { clientApi, Client, Session } from "../api/clientApi";

const ClientScreen = ({ setHeaderTitle }: { setHeaderTitle: (title: string) => void }) => {
    const [clients, setClients] = useState<Client[]>([]);
    const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
    const [pastSessions, setPastSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setHeaderTitle("Client");

        const loadData = async () => {
            setLoading(true);
            const clientsList = await clientApi.getAllClients();
            const upcoming = await clientApi.getUpcomingSessions();
            const past = await clientApi.getPastSessions();

            setClients(clientsList);
            setUpcomingSessions(upcoming);
            setPastSessions(past);
            setLoading(false);
        };

        loadData();
    }, []);

      const handleCancelSession = async (id: number) => {
        await clientApi.cancelUpcomingSession(id);
        const updated = await clientApi.getUpcomingSessions();
        setUpcomingSessions(updated);
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
            <Text style={styles.sectionTitle}>Assigned Clients</Text>

            {clients.map((client) => (
                <View key={client.id} style={styles.card}>
                    <View style={styles.avatar}>
                        <Icon name="person" size={30} color="#fff" />
                    </View>
                    <View style={styles.containerCard}>
                        <View style={styles.item}>
                            <Text style={styles.label}>Name</Text>
                            <Text style={styles.value}>{client.name}</Text>
                        </View>

                        <View style={styles.item}>
                            <Text style={styles.label}>PT Plan Name</Text>
                            <Text style={styles.value}>{client.plan}</Text>
                        </View>

                        <View style={styles.item}>
                            <Text style={styles.label}>Next Session Date</Text>
                            <Text style={styles.value}>{client.nextSession}</Text>
                        </View>

                        <View style={styles.item}>
                            <Text style={styles.label}>Workout Assigned</Text>
                            <Text style={styles.value}>{client.workout}{" "}
                                <Icon name="pencil-outline" size={14} color="#999" />
                            </Text>
                        </View>

                        <View style={styles.item}>
                            <Text style={styles.label}>Session Remaining</Text>
                            <Text style={styles.value}>{client.sessionsRemaining}</Text>
                        </View>

                        <TouchableOpacity style={styles.whatsappButton}>
                            <Icon name="logo-whatsapp" size={32} color="#25D366" />
                        </TouchableOpacity>
                    </View>
                </View>
            ))}


             {/* Pagination */}
            <View style={styles.pagination}>
                <Text style={styles.paginationText}>Showing {clients.length} of {clients.length} entries</Text>
            </View>

            {/* Upcoming Session */}
            <View style={styles.table}>
                <Text style={styles.sectionMiniTitle}>Upcoming Session</Text>
                <View style={styles.tableHeader}>
                    <Text style={[styles.headerCell, { flex: 1 }]}>Date</Text>
                    <Text style={[styles.headerCell, { flex: 2 }]}>Time</Text>
                    <Text style={[styles.headerCell, { flex: 2 }]}>Customer</Text>
                    <Text style={[styles.headerCell, { flex: 1 }]}>Action</Text>
                </View>
                {upcomingSessions.map((s, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={[styles.cell, { flex: 1 }]}>{s.date}</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>{s.time}</Text>
                        <Text style={[styles.cell, { flex: 2 }]}>{s.customer}</Text>
                         <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancelSession(s.id)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {/* Past Sessions */}
            <View style={styles.table}>
                <Text style={styles.sectionMiniTitle}>Past Sessions</Text>
                <View style={styles.tableHeader}>
                    <Text style={[styles.headerCell, { flex: 1 }]}>Date</Text>
                    <Text style={[styles.headerCell, { flex: 1 }]}>Time</Text>
                    <Text style={[styles.headerCell, { flex: 1 }]}>Customer</Text>
                </View>
                {pastSessions.map((s, index) => (
                    <View key={index} style={styles.tableRow}>
                        <Text style={[styles.cell, { flex: 1 }]}>{s.date}</Text>
                        <Text style={[styles.cell, { flex: 1 }]}>{s.time}</Text>
                        <Text style={[styles.cell, { flex: 1 }]}>{s.customer}</Text>
                    </View>
                ))}
            </View>

            {/* Pagination */}
            <View style={styles.pagination}>
                <Text style={styles.paginationText}>Showing {pastSessions.length} of {pastSessions.length} entries</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 10 },
    sectionTitle: {
        fontSize: 25,
        fontWeight: "600",
        marginTop: 35,
        marginBottom: 20,
        color: "#222",
        alignSelf: "center",
        lineHeight: 35
    },
    sectionMiniTitle: {
        fontSize: 18,
        fontWeight: "500",
        marginTop: 15,
        marginBottom: 20,
        color: "#333",
        lineHeight: 35,
        borderBottomWidth: 1,
        borderBottomColor: "#737373",
        paddingBottom: 5,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#F6F6F8',
        borderRadius: 10,
        padding: 22,
        marginBottom: 15,
        height: 258,
        alignItems: 'flex-start',
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 50,
        backgroundColor: "#BBBBBB",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15
    },
    containerCard: {
        flex: 1,
        // justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    item: {
        marginBottom: 20,
        gap: 10,
        flexDirection: 'column',
    },
    label: {
        fontWeight: "500",
        color: "#000",
        fontSize: 15,
    },
    value: {
        color: "#333",
        fontSize: 15,
    },
    whatsappButton: {
        marginLeft: 12
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 15
    },
    paginationText: {
        color: "#333",
        fontSize: 17,
    },
    paginationButtons: {
        flexDirection: "row",
        gap: 6
    },
    pageBtn: {
        paddingHorizontal: 4,
        paddingVertical: 2
    },
    activePage: {
        backgroundColor: "#28a745",
        color: "#fff"
    },
    table: {
        backgroundColor: "#F6F6F8",
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    tableHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 6
    },
    headerCell: {
        fontWeight: "500",
        color: "#000",
        fontSize: 15
    },
    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8
    },
    cell: {
        color: "#737373",
        fontSize: 15,
        fontWeight: 500
    },
    cancelBtn: {
        backgroundColor: "#ff3b30",
        borderRadius: 6,
        paddingVertical: 4,
        paddingHorizontal: 10
    },
    cancelText: { color: "#fff", fontWeight: "600" }
})

export default ClientScreen;