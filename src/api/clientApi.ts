export interface Client {
    id: number;
    name: string;
    workout: string;
    plan: string;
    sessionsRemaining: number;
    nextSession: string;
}

export interface Session {
    id: number;
    date: string;
    time: string;
    customer: string;
}

// In-memory mock data
let clients: Client[] = [
    {
        id: 1,
        name: "Deepak Singh",
        workout: "Beginner’s 3 day",
        plan: "24 Sessions",
        sessionsRemaining: 12,
        nextSession: "24 August 2025",
    },
    {
        id: 2,
        name: "Rahul Sharma",
        workout: "Intermediate Plan",
        plan: "12 Sessions",
        sessionsRemaining: 5,
        nextSession: "20 August 2025",
    },
    {
        id: 3,
        name: "Anjali Verma",
        workout: "Advanced Strength",
        plan: "16 Sessions",
        sessionsRemaining: 8,
        nextSession: "28 August 2025",
    },
];

let upcomingSessions: Session[] = [
    { id: 1, date: "20 Apr 2025", time: "11:00 AM - 12:00 PM", customer: "Rahul Sharma" },
    { id: 2, date: "23 Apr 2025", time: "12:30 PM - 1:30 PM", customer: "Rahul Sharma" },
];

let pastSessions: Session[] = [
    { id: 1, date: "10 Apr 2025", time: "11:00 AM - 12:00 PM", customer: "Deepak Singh" },
    { id: 2, date: "12 Apr 2025", time: "12:30 PM - 1:30 PM", customer: "Anjali Verma" },
];

export const clientApi = {
    // -------------------------
    // CLIENT OPERATIONS
    // -------------------------
    async getAllClients(): Promise<Client[]> {
        await delay(300);
        return clients;
    },

    async getClientById(id: number): Promise<Client | undefined> {
        await delay(200);
        return clients.find(c => c.id === id);
    },

    async addClient(client: Omit<Client, "id">): Promise<Client> {
        await delay(300);
        const newClient: Client = { ...client, id: Date.now() };
        clients.push(newClient);
        console.log("Client added:", newClient);
        return newClient;
    },

    async updateClient(id: number, updatedData: Partial<Client>): Promise<void> {
        await delay(300);
        clients = clients.map(c => (c.id === id ? { ...c, ...updatedData } : c));
        console.log("Client updated:", id);
    },

    async deleteClient(id: number): Promise<void> {
        await delay(300);
        clients = clients.filter(c => c.id !== id);
        console.log("Client deleted:", id);
    },

    // -------------------------
    // UPCOMING SESSIONS
    // -------------------------
    async getUpcomingSessions(): Promise<Session[]> {
        await delay(300);
        return upcomingSessions;
    },

    async addUpcomingSession(session: Omit<Session, "id">): Promise<Session> {
        await delay(300);
        const newSession: Session = { ...session, id: Date.now() };
        upcomingSessions.push(newSession);
        console.log("Upcoming session added:", newSession);
        return newSession;
    },

    async cancelUpcomingSession(id: number): Promise<void> {
        await delay(300);
        upcomingSessions = upcomingSessions.filter(s => s.id !== id);
        console.log("Upcoming session cancelled:", id);
    },

    // -------------------------
    // PAST SESSIONS
    // -------------------------
    async getPastSessions(): Promise<Session[]> {
        await delay(300);
        return pastSessions;
    },

    async addPastSession(session: Omit<Session, "id">): Promise<Session> {
        await delay(300);
        const newSession: Session = { ...session, id: Date.now() };
        pastSessions.push(newSession);
        console.log("Past session added:", newSession);
        return newSession;
    },
};

// Helper to simulate latency
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
