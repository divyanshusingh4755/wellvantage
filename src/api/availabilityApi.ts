type Slot = {
    id: number;
    startTime: string;
    endTime: string;
    status: "Open" | "Booked";
}

const mockData: Record<string, Slot[]> = {
    "2025-02-06": [
        { id: 1, startTime: "9:00 am", endTime: "10:00 am", status: "Open" },
        { id: 2, startTime: "9:30 am", endTime: "10:30 am", status: "Booked" },
    ],
}

export const availabilityApi = {
    async getSlots(date: string): Promise<Slot[]> {
        console.log("Fetching slots for", date);
        await new Promise((r) => setTimeout(r, 600));
        return mockData[date] || [];
    },

    async addSlot(date: string, slot: Slot): Promise<void> {
        console.log("Adding slot:", slot, "for", date);
        await new Promise((r) => setTimeout(r, 400));
        if (!mockData[date]) mockData[date] = [];
        mockData[date].push(slot);
    },

    async deleteSlot(date: string, id: number): Promise<void>{
        console.log("Deleting slot:", id, "for", date);

        await new Promise((r) => setTimeout(r, 300));
        if(mockData[date]){
            mockData[date] = mockData[date].filter((slot) => slot.id !== id);
        }
    }
}