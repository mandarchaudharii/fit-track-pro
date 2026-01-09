import { useState, useEffect } from 'react';
import { Plus, Timer, StopCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { SetRow } from '@/components/workout/SetRow';
import { RestTimer } from '@/components/workout/RestTimer';
import { useFitness } from '@/contexts/FitnessContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { differenceInSeconds } from 'date-fns';

export default function WorkoutPage() {
  const navigate = useNavigate();
  const { 
    exercises, 
    categories, 
    settings,
    getActiveWorkout, 
    startWorkout, 
    endWorkout, 
    addSet, 
    updateSet, 
    deleteSet,
    toggleFavorite 
  } = useFitness();

  const [activeWorkout, setActiveWorkout] = useState(getActiveWorkout());
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showInlineTimer, setShowInlineTimer] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [inlineAutoStart, setInlineAutoStart] = useState(false);

  useEffect(() => {
    const workout = getActiveWorkout();
    setActiveWorkout(workout);
  }, [getActiveWorkout]);

  useEffect(() => {
    if (!activeWorkout) return;
    
    const interval = setInterval(() => {
      const start = new Date(activeWorkout.startTime);
      setElapsedTime(differenceInSeconds(new Date(), start));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWorkout]);

  const formatElapsedTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWorkout = () => {
    const workout = startWorkout();
    setActiveWorkout(workout);
  };

  const handleEndWorkout = () => {
    if (activeWorkout) {
      endWorkout(activeWorkout.id);
      setActiveWorkout(undefined);
      navigate('/');
    }
  };

  const handleAddExercise = (exerciseId: string) => {
    if (!activeWorkout) return;
    const exercise = exercises.find(e => e.id === exerciseId);
    if (!exercise) return;
    
    addSet(activeWorkout.id, {
      exerciseId,
      isComplete: false,
    });
    setActiveWorkout(getActiveWorkout());
    setShowExerciseSelector(false);
  };

  const handleAddSet = (exerciseId: string) => {
    if (!activeWorkout) return;
    const lastSet = [...activeWorkout.sets]
      .reverse()
      .find(s => s.exerciseId === exerciseId);
    
    addSet(activeWorkout.id, {
      exerciseId,
      weight: lastSet?.weight,
      reps: lastSet?.reps,
      isComplete: false,
    });
    setActiveWorkout(getActiveWorkout());
  };

  const openManualTimer = () => {
    setInlineAutoStart(false);
    setTimerKey(prev => prev + 1);
    setShowInlineTimer(true);
  };

  const handleSetComplete = (setId: string, isComplete: boolean) => {
    if (!activeWorkout) return;
    updateSet(activeWorkout.id, setId, { isComplete: !isComplete });
    setActiveWorkout(getActiveWorkout());

    // Auto-start timer when completing a set
    if (!isComplete) {
      setInlineAutoStart(settings.autoStartTimer);
      setTimerKey(prev => prev + 1);
      setShowInlineTimer(true);
    }
  };

  const groupedSets = activeWorkout?.sets.reduce((acc, set) => {
    if (!acc[set.exerciseId]) {
      acc[set.exerciseId] = [];
    }
    acc[set.exerciseId].push(set);
    return acc;
  }, {} as Record<string, typeof activeWorkout.sets>) || {};

  const filteredExercises = exercises.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!activeWorkout) {
    return (
      <>
        <Header title="Workout" />
        <PageContainer>
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">No Active Workout</h2>
              <p className="text-muted-foreground">Start a new workout to begin tracking</p>
            </div>
            <Button size="lg" onClick={handleStartWorkout}>
              Start Workout
            </Button>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Header 
        title="Workout" 
        rightContent={
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-muted-foreground">
              {formatElapsedTime(elapsedTime)}
            </span>
            <Button variant="ghost" size="icon" onClick={openManualTimer}>
              <Timer className="h-5 w-5" />
            </Button>
          </div>
        }
      />
      <PageContainer className="pb-32">
        <div className="space-y-4">
          {Object.entries(groupedSets).map(([exerciseId, sets]) => {
            const exercise = exercises.find(e => e.id === exerciseId);
            if (!exercise) return null;
            const category = categories.find(c => c.id === exercise.categoryId);
            
            return (
              <Card key={exerciseId}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-1 h-6 rounded-full" 
                      style={{ backgroundColor: category?.color || 'hsl(var(--muted))' }}
                    />
                    <CardTitle className="text-base">{exercise.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sets.map((set, index) => (
                    <SetRow
                      key={set.id}
                      set={set}
                      index={index}
                      exerciseType={exercise.type}
                      onUpdate={(updates) => {
                        updateSet(activeWorkout.id, set.id, updates);
                        setActiveWorkout(getActiveWorkout());
                      }}
                      onDelete={() => {
                        deleteSet(activeWorkout.id, set.id);
                        setActiveWorkout(getActiveWorkout());
                      }}
                      onComplete={() => handleSetComplete(set.id, set.isComplete)}
                    />
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleAddSet(exerciseId)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Set
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          <Button 
            variant="outline" 
            className="w-full h-14"
            onClick={() => setShowExerciseSelector(true)}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Exercise
          </Button>

          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => setShowEndConfirm(true)}
          >
            <StopCircle className="h-5 w-5 mr-2" />
            Finish Workout
          </Button>
        </div>
      </PageContainer>

      {/* Inline Rest Timer - Fixed at bottom */}
      {showInlineTimer && (
        <div className="fixed bottom-20 left-0 right-0 z-40 px-4 safe-area-pb">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-muted z-10"
              onClick={() => setShowInlineTimer(false)}
            >
              <X className="h-3 w-3" />
            </Button>
            <RestTimer 
              key={timerKey}
              defaultSeconds={settings.defaultRestTimer} 
              autoStart={inlineAutoStart}
              compact
              soundEnabled={settings.soundEnabled}
              vibrationEnabled={settings.vibrationEnabled}
            />
          </div>
        </div>
      )}

      <Dialog open={showExerciseSelector} onOpenChange={setShowExerciseSelector}>
        <DialogContent className="max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Select Exercise</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          <div className="space-y-2 overflow-y-auto flex-1">
            {filteredExercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                category={categories.find(c => c.id === exercise.categoryId)}
                onSelect={() => handleAddExercise(exercise.id)}
                onFavorite={() => toggleFavorite(exercise.id)}
                showArrow={false}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showEndConfirm} onOpenChange={setShowEndConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finish Workout?</AlertDialogTitle>
            <AlertDialogDescription>
              This will end your current workout and save all your sets.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndWorkout}>
              Finish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}