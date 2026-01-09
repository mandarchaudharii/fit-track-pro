import { useLocalStorage } from './useLocalStorage';
import { 
  Exercise, 
  Category, 
  Workout, 
  WorkoutSet,
  PersonalRecord,
  Routine,
  RoutineExercise,
  BodyMeasurement,
  MeasurementEntry,
  ProgressionPlan,
  ProgressionSession,
  Goal
} from '@/types/fitness';
import { calculateAverage1RM } from '@/utils/calculators';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Chest', color: 'hsl(0, 70%, 50%)', order: 0 },
  { id: '2', name: 'Back', color: 'hsl(210, 70%, 50%)', order: 1 },
  { id: '3', name: 'Shoulders', color: 'hsl(45, 70%, 50%)', order: 2 },
  { id: '4', name: 'Arms', color: 'hsl(280, 70%, 50%)', order: 3 },
  { id: '5', name: 'Legs', color: 'hsl(120, 70%, 50%)', order: 4 },
  { id: '6', name: 'Core', color: 'hsl(180, 70%, 50%)', order: 5 },
  { id: '7', name: 'Cardio', color: 'hsl(330, 70%, 50%)', order: 6 },
];

const DEFAULT_EXERCISES: Exercise[] = [
  { id: '1', name: 'Bench Press', categoryId: '1', type: 'weight', isFavorite: true, createdAt: new Date().toISOString() },
  { id: '2', name: 'Incline Dumbbell Press', categoryId: '1', type: 'weight', isFavorite: false, createdAt: new Date().toISOString() },
  { id: '3', name: 'Deadlift', categoryId: '2', type: 'weight', isFavorite: true, createdAt: new Date().toISOString() },
  { id: '4', name: 'Pull-ups', categoryId: '2', type: 'bodyweight', isFavorite: true, createdAt: new Date().toISOString() },
  { id: '5', name: 'Barbell Row', categoryId: '2', type: 'weight', isFavorite: false, createdAt: new Date().toISOString() },
  { id: '6', name: 'Overhead Press', categoryId: '3', type: 'weight', isFavorite: true, createdAt: new Date().toISOString() },
  { id: '7', name: 'Lateral Raises', categoryId: '3', type: 'weight', isFavorite: false, createdAt: new Date().toISOString() },
  { id: '8', name: 'Bicep Curls', categoryId: '4', type: 'weight', isFavorite: false, createdAt: new Date().toISOString() },
  { id: '9', name: 'Tricep Dips', categoryId: '4', type: 'bodyweight', isFavorite: false, createdAt: new Date().toISOString() },
  { id: '10', name: 'Squat', categoryId: '5', type: 'weight', isFavorite: true, createdAt: new Date().toISOString() },
  { id: '11', name: 'Leg Press', categoryId: '5', type: 'weight', isFavorite: false, createdAt: new Date().toISOString() },
  { id: '12', name: 'Plank', categoryId: '6', type: 'duration', isFavorite: false, createdAt: new Date().toISOString() },
  { id: '13', name: 'Running', categoryId: '7', type: 'distance', isFavorite: false, createdAt: new Date().toISOString() },
];

const DEFAULT_MEASUREMENTS: BodyMeasurement[] = [
  { id: '1', name: 'Weight', unit: 'kg', isEnabled: true, isCustom: false, order: 0 },
  { id: '2', name: 'Body Fat', unit: '%', isEnabled: true, isCustom: false, order: 1 },
  { id: '3', name: 'Chest', unit: 'cm', isEnabled: true, isCustom: false, order: 2 },
  { id: '4', name: 'Waist', unit: 'cm', isEnabled: true, isCustom: false, order: 3 },
  { id: '5', name: 'Hips', unit: 'cm', isEnabled: true, isCustom: false, order: 4 },
  { id: '6', name: 'Biceps', unit: 'cm', isEnabled: true, isCustom: false, order: 5 },
  { id: '7', name: 'Thighs', unit: 'cm', isEnabled: true, isCustom: false, order: 6 },
  { id: '8', name: 'Calves', unit: 'cm', isEnabled: false, isCustom: false, order: 7 },
  { id: '9', name: 'Neck', unit: 'cm', isEnabled: false, isCustom: false, order: 8 },
  { id: '10', name: 'Forearms', unit: 'cm', isEnabled: false, isCustom: false, order: 9 },
];

export interface UserSettings {
  weightUnit: 'kg' | 'lbs';
  distanceUnit: 'km' | 'miles';
  defaultRestTimer: number;
  autoStartTimer: boolean;
  showWarmupSets: boolean;
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  darkMode: 'system' | 'light' | 'dark';
}

const DEFAULT_SETTINGS: UserSettings = {
  weightUnit: 'kg',
  distanceUnit: 'km',
  defaultRestTimer: 90,
  autoStartTimer: true,
  showWarmupSets: true,
  vibrationEnabled: true,
  soundEnabled: true,
  darkMode: 'system',
};

export function useFitnessData() {
  const [exercises, setExercises] = useLocalStorage<Exercise[]>('fittrack-exercises', DEFAULT_EXERCISES);
  const [categories, setCategories] = useLocalStorage<Category[]>('fittrack-categories', DEFAULT_CATEGORIES);
  const [workouts, setWorkouts] = useLocalStorage<Workout[]>('fittrack-workouts', []);
  const [personalRecords, setPersonalRecords] = useLocalStorage<PersonalRecord[]>('fittrack-prs', []);
  const [routines, setRoutines] = useLocalStorage<Routine[]>('fittrack-routines', []);
  const [measurements, setMeasurements] = useLocalStorage<BodyMeasurement[]>('fittrack-measurements', DEFAULT_MEASUREMENTS);
  const [measurementEntries, setMeasurementEntries] = useLocalStorage<MeasurementEntry[]>('fittrack-measurement-entries', []);
  const [progressionPlans, setProgressionPlans] = useLocalStorage<ProgressionPlan[]>('fittrack-progressions', []);
  const [goals, setGoals] = useLocalStorage<Goal[]>('fittrack-goals', []);
  const [settings, setSettings] = useLocalStorage<UserSettings>('fittrack-settings', DEFAULT_SETTINGS);

  const generateId = () => crypto.randomUUID();

  // Exercise functions
  const addExercise = (exercise: Omit<Exercise, 'id' | 'createdAt'>) => {
    const newExercise: Exercise = {
      ...exercise,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setExercises(prev => [...prev, newExercise]);
    return newExercise;
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setExercises(prev => prev.map(e => e.id === id ? { ...e, isFavorite: !e.isFavorite } : e));
  };

  const getExerciseHistory = (exerciseId: string) => {
    return workouts
      .filter(w => !w.isActive && w.sets.some(s => s.exerciseId === exerciseId))
      .map(w => ({
        workout: w,
        sets: w.sets.filter(s => s.exerciseId === exerciseId),
      }))
      .sort((a, b) => new Date(b.workout.date).getTime() - new Date(a.workout.date).getTime());
  };

  // Category functions
  const addCategory = (category: Omit<Category, 'id' | 'order'>) => {
    const newCategory: Category = {
      ...category,
      id: generateId(),
      order: categories.length,
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const reorderCategories = (categoryIds: string[]) => {
    setCategories(prev => 
      categoryIds.map((id, index) => {
        const cat = prev.find(c => c.id === id);
        return cat ? { ...cat, order: index } : null;
      }).filter(Boolean) as Category[]
    );
  };

  // Workout functions
  const startWorkout = () => {
    const newWorkout: Workout = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toISOString(),
      sets: [],
      isActive: true,
    };
    setWorkouts(prev => [...prev, newWorkout]);
    return newWorkout;
  };

  const endWorkout = (id: string) => {
    setWorkouts(prev => prev.map(w => 
      w.id === id ? { ...w, endTime: new Date().toISOString(), isActive: false } : w
    ));
    // Update personal records after workout ends
    const workout = workouts.find(w => w.id === id);
    if (workout) {
      updatePersonalRecords(workout);
    }
  };

  const updateWorkout = (id: string, updates: Partial<Workout>) => {
    setWorkouts(prev => prev.map(w => 
      w.id === id ? { ...w, ...updates } : w
    ));
  };

  const addSet = (workoutId: string, set: Omit<WorkoutSet, 'id' | 'createdAt'>) => {
    const newSet: WorkoutSet = {
      ...set,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setWorkouts(prev => prev.map(w => 
      w.id === workoutId ? { ...w, sets: [...w.sets, newSet] } : w
    ));
    return newSet;
  };

  const updateSet = (workoutId: string, setId: string, updates: Partial<WorkoutSet>) => {
    setWorkouts(prev => prev.map(w => 
      w.id === workoutId ? {
        ...w,
        sets: w.sets.map(s => s.id === setId ? { ...s, ...updates } : s)
      } : w
    ));
  };

  const deleteSet = (workoutId: string, setId: string) => {
    setWorkouts(prev => prev.map(w => 
      w.id === workoutId ? { ...w, sets: w.sets.filter(s => s.id !== setId) } : w
    ));
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  const copyWorkout = (id: string) => {
    const workout = workouts.find(w => w.id === id);
    if (!workout) return null;

    const newWorkout: Workout = {
      ...workout,
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toISOString(),
      endTime: undefined,
      isActive: true,
      sets: workout.sets.map(s => ({
        ...s,
        id: generateId(),
        isComplete: false,
        createdAt: new Date().toISOString(),
      })),
    };
    setWorkouts(prev => [...prev, newWorkout]);
    return newWorkout;
  };

  const moveWorkout = (id: string, newDate: string) => {
    setWorkouts(prev => prev.map(w => 
      w.id === id ? { ...w, date: newDate } : w
    ));
  };

  const getActiveWorkout = () => workouts.find(w => w.isActive);

  const getWorkoutById = (id: string) => workouts.find(w => w.id === id);

  // Personal Records functions
  const updatePersonalRecords = (workout: Workout) => {
    const newRecords: PersonalRecord[] = [];
    
    workout.sets.forEach(set => {
      if (!set.isComplete || !set.weight || !set.reps) return;
      
      const exercise = exercises.find(e => e.id === set.exerciseId);
      if (!exercise || exercise.type !== 'weight') return;

      // Check weight PR
      const existingWeightPR = personalRecords.find(
        pr => pr.exerciseId === set.exerciseId && pr.type === 'weight'
      );
      if (!existingWeightPR || set.weight > existingWeightPR.value) {
        newRecords.push({
          exerciseId: set.exerciseId,
          type: 'weight',
          value: set.weight,
          date: workout.date,
          setId: set.id,
        });
      }

      // Check reps PR at same or higher weight
      const existingRepsPR = personalRecords.find(
        pr => pr.exerciseId === set.exerciseId && pr.type === 'reps'
      );
      if (!existingRepsPR || set.reps > existingRepsPR.value) {
        newRecords.push({
          exerciseId: set.exerciseId,
          type: 'reps',
          value: set.reps,
          date: workout.date,
          setId: set.id,
        });
      }

      // Check estimated 1RM PR
      const estimated1RM = calculateAverage1RM(set.weight, set.reps);
      const existing1RMPR = personalRecords.find(
        pr => pr.exerciseId === set.exerciseId && pr.type === 'estimated1RM'
      );
      if (!existing1RMPR || estimated1RM > existing1RMPR.value) {
        newRecords.push({
          exerciseId: set.exerciseId,
          type: 'estimated1RM',
          value: Math.round(estimated1RM * 10) / 10,
          date: workout.date,
          setId: set.id,
        });
      }

      // Check volume PR (weight × reps)
      const volume = set.weight * set.reps;
      const existingVolumePR = personalRecords.find(
        pr => pr.exerciseId === set.exerciseId && pr.type === 'volume'
      );
      if (!existingVolumePR || volume > existingVolumePR.value) {
        newRecords.push({
          exerciseId: set.exerciseId,
          type: 'volume',
          value: volume,
          date: workout.date,
          setId: set.id,
        });
      }
    });

    if (newRecords.length > 0) {
      setPersonalRecords(prev => {
        const filtered = prev.filter(pr => 
          !newRecords.some(nr => nr.exerciseId === pr.exerciseId && nr.type === pr.type)
        );
        return [...filtered, ...newRecords];
      });
    }
  };

  const getPersonalRecords = (exerciseId: string) => {
    return personalRecords.filter(pr => pr.exerciseId === exerciseId);
  };

  // Routine functions
  const addRoutine = (routine: Omit<Routine, 'id' | 'createdAt'>) => {
    const newRoutine: Routine = {
      ...routine,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setRoutines(prev => [...prev, newRoutine]);
    return newRoutine;
  };

  const updateRoutine = (id: string, updates: Partial<Routine>) => {
    setRoutines(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRoutine = (id: string) => {
    setRoutines(prev => prev.filter(r => r.id !== id));
  };

  const startRoutineWorkout = (routineId: string) => {
    const routine = routines.find(r => r.id === routineId);
    if (!routine) return null;

    const workout = startWorkout();
    routine.exercises.forEach(re => {
      for (let i = 0; i < re.sets; i++) {
        addSet(workout.id, {
          exerciseId: re.exerciseId,
          weight: re.weight,
          reps: re.reps,
          isComplete: false,
        });
      }
    });

    return getActiveWorkout();
  };

  // Goal functions
  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'isComplete'>) => {
    const newGoal: Goal = {
      ...goal,
      id: generateId(),
      isComplete: false,
      createdAt: new Date().toISOString(),
    };
    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const completeGoal = (id: string) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, isComplete: true } : g));
  };

  // Progression Plan functions
  const createProgressionPlan = (plan: Omit<ProgressionPlan, 'id' | 'sessions' | 'createdAt'>) => {
    const sessions = generateProgressionSessions(plan);
    const newPlan: ProgressionPlan = {
      ...plan,
      id: generateId(),
      sessions,
      createdAt: new Date().toISOString(),
    };
    setProgressionPlans(prev => [...prev, newPlan]);
    return newPlan;
  };

  const generateProgressionSessions = (plan: Omit<ProgressionPlan, 'id' | 'sessions' | 'createdAt'>) => {
    const sessions: ProgressionSession[] = [];
    const totalSessions = plan.weeks * 2; // 2 sessions per week
    const weightIncrement = (plan.targetWeight - plan.currentWeight) / totalSessions;
    
    for (let i = 0; i < totalSessions; i++) {
      const week = Math.floor(i / 2) + 1;
      const session = (i % 2) + 1;
      sessions.push({
        week,
        session,
        weight: Math.round((plan.currentWeight + weightIncrement * (i + 1)) * 2.5) / 2.5,
        reps: plan.currentReps,
        sets: 3,
        isComplete: false,
      });
    }
    return sessions;
  };

  const updateProgressionPlan = (id: string, updates: Partial<ProgressionPlan>) => {
    setProgressionPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProgressionPlan = (id: string) => {
    setProgressionPlans(prev => prev.filter(p => p.id !== id));
  };

  const completeProgressionSession = (planId: string, sessionIndex: number) => {
    setProgressionPlans(prev => prev.map(p => {
      if (p.id !== planId) return p;
      const sessions = [...p.sessions];
      if (sessions[sessionIndex]) {
        sessions[sessionIndex] = { ...sessions[sessionIndex], isComplete: true };
      }
      return { ...p, sessions };
    }));
  };

  // Body Measurement functions
  const addMeasurement = (measurement: Omit<BodyMeasurement, 'id' | 'order'>) => {
    const newMeasurement: BodyMeasurement = {
      ...measurement,
      id: generateId(),
      order: measurements.length,
    };
    setMeasurements(prev => [...prev, newMeasurement]);
    return newMeasurement;
  };

  const updateMeasurement = (id: string, updates: Partial<BodyMeasurement>) => {
    setMeasurements(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMeasurement = (id: string) => {
    setMeasurements(prev => prev.filter(m => m.id !== id));
    setMeasurementEntries(prev => prev.filter(e => e.measurementId !== id));
  };

  const reorderMeasurements = (measurementIds: string[]) => {
    setMeasurements(prev => 
      measurementIds.map((id, index) => {
        const m = prev.find(m => m.id === id);
        return m ? { ...m, order: index } : null;
      }).filter(Boolean) as BodyMeasurement[]
    );
  };

  const addMeasurementEntry = (entry: Omit<MeasurementEntry, 'id'>) => {
    const newEntry: MeasurementEntry = {
      ...entry,
      id: generateId(),
    };
    setMeasurementEntries(prev => [...prev, newEntry]);
    return newEntry;
  };

  const updateMeasurementEntry = (id: string, updates: Partial<MeasurementEntry>) => {
    setMeasurementEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteMeasurementEntry = (id: string) => {
    setMeasurementEntries(prev => prev.filter(e => e.id !== id));
  };

  const getMeasurementHistory = (measurementId: string) => {
    return measurementEntries
      .filter(e => e.measurementId === measurementId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Settings functions
  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // Statistics functions
  const getStatistics = () => {
    const completedWorkouts = workouts.filter(w => !w.isActive);
    const totalSets = completedWorkouts.reduce((acc, w) => acc + w.sets.length, 0);
    const totalVolume = completedWorkouts.reduce((acc, w) => 
      acc + w.sets.reduce((setAcc, s) => setAcc + ((s.weight || 0) * (s.reps || 0)), 0), 0
    );

    // Weekly workouts
    const weeklyWorkouts: Record<string, number> = {};
    completedWorkouts.forEach(w => {
      const weekStart = new Date(w.date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      weeklyWorkouts[weekKey] = (weeklyWorkouts[weekKey] || 0) + 1;
    });

    // Category distribution
    const categoryDistribution: Record<string, number> = {};
    completedWorkouts.forEach(w => {
      w.sets.forEach(s => {
        const exercise = exercises.find(e => e.id === s.exerciseId);
        if (exercise) {
          const category = categories.find(c => c.id === exercise.categoryId);
          if (category) {
            categoryDistribution[category.name] = (categoryDistribution[category.name] || 0) + 1;
          }
        }
      });
    });

    return {
      totalWorkouts: completedWorkouts.length,
      totalSets,
      totalVolume,
      weeklyWorkouts,
      categoryDistribution,
    };
  };

  // Clear all data
  const clearAllData = () => {
    setExercises(DEFAULT_EXERCISES);
    setCategories(DEFAULT_CATEGORIES);
    setWorkouts([]);
    setPersonalRecords([]);
    setRoutines([]);
    setMeasurements(DEFAULT_MEASUREMENTS);
    setMeasurementEntries([]);
    setProgressionPlans([]);
    setGoals([]);
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    // Data
    exercises,
    categories,
    workouts,
    personalRecords,
    routines,
    measurements,
    measurementEntries,
    progressionPlans,
    goals,
    settings,
    
    // Exercise functions
    addExercise,
    updateExercise,
    deleteExercise,
    toggleFavorite,
    getExerciseHistory,
    
    // Category functions
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    setCategories,
    
    // Workout functions
    startWorkout,
    endWorkout,
    updateWorkout,
    addSet,
    updateSet,
    deleteSet,
    deleteWorkout,
    copyWorkout,
    moveWorkout,
    getActiveWorkout,
    getWorkoutById,
    
    // Personal Records
    getPersonalRecords,
    
    // Routine functions
    addRoutine,
    updateRoutine,
    deleteRoutine,
    startRoutineWorkout,
    setRoutines,
    
    // Goal functions
    addGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
    setGoals,
    
    // Progression Plan functions
    createProgressionPlan,
    updateProgressionPlan,
    deleteProgressionPlan,
    completeProgressionSession,
    
    // Measurement functions
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
    reorderMeasurements,
    setMeasurements,
    addMeasurementEntry,
    updateMeasurementEntry,
    deleteMeasurementEntry,
    getMeasurementHistory,
    
    // Settings functions
    updateSettings,
    
    // Statistics
    getStatistics,
    
    // Clear all
    clearAllData,
  };
}
