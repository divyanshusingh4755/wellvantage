export interface WorkoutPlan {
    id: number;
    name: string;
    days?: Day[];
}

export interface Day {
    id: number;
    name: string;
    exercises?: Exercise[];
}

export interface Exercise {
    id: number;
    name: string;
    sets: string;
    reps: string;
}

let workoutPlans: WorkoutPlan[] = [
    { id: 1, name: "Custom Workout Plan" },
    { id: 2, name: "Beginner's Workout" },
    { id: 3, name: "Intermediate Plan" },
    { id: 4, name: "Advanced Strength" },
    { id: 5, name: "Full Body Split" },
];

export const workoutManagementApi = {
    // Fetch all workout plans
    async getAllPlans(): Promise<WorkoutPlan[]> {
        await delay(300);
        return workoutPlans;
    },

    // Get a single plan by ID
    async getPlanById(id: number): Promise<WorkoutPlan | undefined> {
        await delay(200);
        return workoutPlans.find(p => p.id === id);
    },

    // Add a new plan
    async addPlan(name: string): Promise<WorkoutPlan> {
        await delay(300);
        const newPlan: WorkoutPlan = { id: Date.now(), name };
        workoutPlans.push(newPlan);
        console.log("Plan added:", newPlan);
        return newPlan;
    },

    // Update a plan
    async updatePlan(id: number, name: string): Promise<void> {
        await delay(300);
        workoutPlans = workoutPlans.map(p => p.id === id ? { ...p, name } : p);
        console.log("Plan updated:", id);
    },

    // Delete a plan
    async deletePlan(id: number): Promise<void> {
        await delay(300);
        workoutPlans = workoutPlans.filter(p => p.id !== id);
        console.log("Plan deleted:", id);
    }
};

// Helper to simulate network latency
function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
