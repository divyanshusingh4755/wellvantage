export interface Exercise {
    id: number;
    name: string;
    sets: string;
    reps: string;
}

export interface Day {
    id: number;
    name: string;
    exercises: Exercise[];
}

export interface Workout {
    id: number;
    name: string;
    days: Day[];
    note?: string;
}

// In-memory mock data
let workouts: Workout[] = [
    {
        id: 1,
        name: "Beginner’s Workout - 3 Days",
        days: [
            {
                id: 101,
                name: "Chest",
                exercises: [
                    { id: 1001, name: "Push Ups", sets: "3", reps: "12–15" },
                    { id: 1002, name: "Bench Press", sets: "4", reps: "8–10" },
                    { id: 1003, name: "Planks", sets: "3", reps: "30 secs" },
                ],
            },
        ],
        note: "Basic full-body starter plan",
    },
];

export const workoutApi = {
    // -------------------------
    // WORKOUT CRUD
    // -------------------------

    async getAllWorkouts(): Promise<Workout[]> {
        await delay(400);
        return workouts;
    },

    async getWorkoutById(id: number): Promise<Workout | undefined> {
        await delay(300);
        return workouts.find((w) => w.id === id);
    },

    async addWorkout(workout: Omit<Workout, "id">): Promise<Workout> {
        await delay(500);
        const newWorkout: Workout = { ...workout, id: Date.now() };
        workouts.push(newWorkout);
        console.log("Workout added:", newWorkout);
        return newWorkout;
    },

    async updateWorkout(id: number, updated: Partial<Workout>): Promise<void> {
        await delay(500);
        workouts = workouts.map((w) => (w.id === id ? { ...w, ...updated } : w));
        console.log("Workout updated:", id);
    },

    async deleteWorkout(id: number): Promise<void> {
        await delay(400);
        workouts = workouts.filter((w) => w.id !== id);
        console.log("Workout deleted:", id);
    },

    // -------------------------
    // DAY-LEVEL OPERATIONS
    // -------------------------

    async addDay(workoutId: number, dayName: string): Promise<Day> {
        await delay(400);
        const day: Day = { id: Date.now(), name: dayName, exercises: [] };
        workouts = workouts.map((w) =>
            w.id === workoutId ? { ...w, days: [...w.days, day] } : w
        );
        console.log(`Day added to workout ${workoutId}:`, day);
        return day;
    },

    async deleteDay(workoutId: number, dayId: number): Promise<void> {
        await delay(300);
        workouts = workouts.map((w) =>
            w.id === workoutId
                ? { ...w, days: w.days.filter((d) => d.id !== dayId) }
                : w
        );
        console.log(`Day ${dayId} deleted from workout ${workoutId}`);
    },

    // -------------------------
    // EXERCISE-LEVEL OPERATIONS
    // -------------------------

    async addExercise(workoutId: number, dayId: number, exercise: Omit<Exercise, "id">): Promise<Exercise> {
        await delay(400);
        const newExercise: Exercise = { ...exercise, id: Date.now() };
        workouts = workouts.map((w) => {
            if (w.id === workoutId) {
                const days = w.days.map((d) =>
                    d.id === dayId
                        ? { ...d, exercises: [...d.exercises, newExercise] }
                        : d
                );
                return { ...w, days };
            }
            return w;
        });
        console.log(`Added exercise to day ${dayId}:`, newExercise);
        return newExercise;
    },

    async updateExercise(
        workoutId: number,
        dayId: number,
        exerciseId: number,
        updatedData: Partial<Exercise>
    ): Promise<void> {
        await delay(400);
        workouts = workouts.map((w) => {
            if (w.id === workoutId) {
                const days = w.days.map((d) => {
                    if (d.id === dayId) {
                        const exercises = d.exercises.map((ex) =>
                            ex.id === exerciseId ? { ...ex, ...updatedData } : ex
                        );
                        return { ...d, exercises };
                    }
                    return d;
                });
                return { ...w, days };
            }
            return w;
        });
        console.log(`Updated exercise ${exerciseId} in day ${dayId}`);
    },

    async deleteExercise(workoutId: number, dayId: number, exerciseId: number): Promise<void> {
        await delay(300);
        workouts = workouts.map((w) => {
            if (w.id === workoutId) {
                const days = w.days.map((d) =>
                    d.id === dayId
                        ? { ...d, exercises: d.exercises.filter((ex) => ex.id !== exerciseId) }
                        : d
                );
                return { ...w, days };
            }
            return w;
        });
        console.log(`Deleted exercise ${exerciseId} from day ${dayId}`);
    },
};

// Helper to simulate latency
function delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}
