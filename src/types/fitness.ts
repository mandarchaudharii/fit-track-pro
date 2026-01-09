export interface Exercise {
  id: string;
  name: string;
  categoryId: string;
  type: 'weight' | 'bodyweight' | 'duration' | 'distance';
  isFavorite: boolean;
  notes?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  weight?: number;
  reps?: number;
  duration?: number;
  distance?: number;
  isComplete: boolean;
  comment?: string;
  createdAt: string;
}

export interface Workout {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  sets: WorkoutSet[];
  comment?: string;
  isActive: boolean;
}

export interface PersonalRecord {
  exerciseId: string;
  type: 'weight' | 'reps' | 'volume' | 'estimated1RM';
  value: number;
  date: string;
  setId: string;
}

export interface Routine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  createdAt: string;
}

export interface RoutineExercise {
  exerciseId: string;
  sets: number;
  reps?: number;
  weight?: number;
  order: number;
}

export interface BodyMeasurement {
  id: string;
  name: string;
  unit: string;
  isEnabled: boolean;
  isCustom: boolean;
  order: number;
}

export interface MeasurementEntry {
  id: string;
  measurementId: string;
  value: number;
  date: string;
}

export interface ProgressionPlan {
  id: string;
  exerciseId: string;
  currentWeight: number;
  currentReps: number;
  targetWeight: number;
  targetReps: number;
  weeks: number;
  sessions: ProgressionSession[];
  createdAt: string;
}

export interface ProgressionSession {
  week: number;
  session: number;
  weight: number;
  reps: number;
  sets: number;
  isComplete: boolean;
}

export interface Goal {
  id: string;
  exerciseId: string;
  targetValue: number;
  targetType: 'weight' | 'reps' | '1RM';
  deadline?: string;
  isComplete: boolean;
  createdAt: string;
}
