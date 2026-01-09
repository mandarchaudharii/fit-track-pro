import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Edit, Trash2, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFitness } from '@/contexts/FitnessContext';
import { RoutineExercise } from '@/types/fitness';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useToast } from '@/hooks/use-toast';

export default function RoutinesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    routines, 
    exercises, 
    categories,
    addRoutine, 
    updateRoutine,
    deleteRoutine, 
    startRoutineWorkout,
  } = useFitness();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<string | null>(null);
  const [routineName, setRoutineName] = useState('');
  const [routineExercises, setRoutineExercises] = useState<RoutineExercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleStartRoutine = (routineId: string) => {
    startRoutineWorkout(routineId);
    navigate('/workout');
    toast({ title: 'Workout started from routine' });
  };

  const handleAddExercise = (exerciseId: string) => {
    const newExercise: RoutineExercise = {
      exerciseId,
      sets: 3,
      reps: 10,
      order: routineExercises.length,
    };
    setRoutineExercises([...routineExercises, newExercise]);
    setShowExerciseSelector(false);
  };

  const handleUpdateExercise = (index: number, updates: Partial<RoutineExercise>) => {
    const updated = [...routineExercises];
    updated[index] = { ...updated[index], ...updates };
    setRoutineExercises(updated);
  };

  const handleRemoveExercise = (index: number) => {
    setRoutineExercises(routineExercises.filter((_, i) => i !== index));
  };

  const handleSaveRoutine = () => {
    if (!routineName || routineExercises.length === 0) return;
    
    if (editingRoutine) {
      updateRoutine(editingRoutine, {
        name: routineName,
        exercises: routineExercises,
      });
      toast({ title: 'Routine updated' });
    } else {
      addRoutine({
        name: routineName,
        exercises: routineExercises,
      });
      toast({ title: 'Routine created' });
    }
    
    resetForm();
  };

  const handleEditRoutine = (routineId: string) => {
    const routine = routines.find(r => r.id === routineId);
    if (!routine) return;
    
    setEditingRoutine(routineId);
    setRoutineName(routine.name);
    setRoutineExercises([...routine.exercises]);
    setShowEditDialog(true);
  };

  const handleDeleteRoutine = (routineId: string) => {
    deleteRoutine(routineId);
    setShowDeleteConfirm(null);
    toast({ title: 'Routine deleted' });
  };

  const resetForm = () => {
    setShowAddDialog(false);
    setShowEditDialog(false);
    setEditingRoutine(null);
    setRoutineName('');
    setRoutineExercises([]);
  };

  const filteredExercises = exercises.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const RoutineForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Routine Name</Label>
        <Input
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
          placeholder="e.g., Push Day"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Exercises</Label>
        <div className="space-y-2">
          {routineExercises.map((re, index) => {
            const exercise = exercises.find(e => e.id === re.exerciseId);
            const category = categories.find(c => c.id === exercise?.categoryId);
            
            return (
              <div 
                key={index}
                className="flex items-center gap-2 p-3 bg-muted rounded-lg"
              >
                <div 
                  className="w-1 h-8 rounded-full" 
                  style={{ backgroundColor: category?.color || 'hsl(var(--muted))' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{exercise?.name}</p>
                </div>
                <Input
                  type="number"
                  value={re.sets}
                  onChange={(e) => handleUpdateExercise(index, { sets: parseInt(e.target.value) || 1 })}
                  className="w-16 text-center"
                  min={1}
                />
                <span className="text-muted-foreground">×</span>
                <Input
                  type="number"
                  value={re.reps}
                  onChange={(e) => handleUpdateExercise(index, { reps: parseInt(e.target.value) || 1 })}
                  className="w-16 text-center"
                  min={1}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemoveExercise(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowExerciseSelector(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Exercise
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <Header 
        title="Routines" 
        showBack
        rightContent={
          <Button variant="ghost" size="icon" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-5 w-5" />
          </Button>
        }
      />
      <PageContainer>
        <div className="space-y-3">
          {routines.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No routines yet</p>
                <p className="text-sm">Create a routine to quickly start workouts</p>
                <Button 
                  className="mt-4"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Routine
                </Button>
              </CardContent>
            </Card>
          ) : (
            routines.map(routine => (
              <Card key={routine.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{routine.name}</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditRoutine(routine.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setShowDeleteConfirm(routine.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 mb-3">
                    {routine.exercises.slice(0, 4).map((re, index) => {
                      const exercise = exercises.find(e => e.id === re.exerciseId);
                      return (
                        <p key={index} className="text-sm text-muted-foreground">
                          {exercise?.name}: {re.sets} × {re.reps}
                        </p>
                      );
                    })}
                    {routine.exercises.length > 4 && (
                      <p className="text-sm text-muted-foreground">
                        +{routine.exercises.length - 4} more exercises
                      </p>
                    )}
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => handleStartRoutine(routine.id)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Workout
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </PageContainer>

      {/* Add Routine Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Routine</DialogTitle>
          </DialogHeader>
          <RoutineForm />
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button 
              onClick={handleSaveRoutine}
              disabled={!routineName || routineExercises.length === 0}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Routine Dialog */}
      <Dialog open={showEditDialog} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Routine</DialogTitle>
          </DialogHeader>
          <RoutineForm />
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button 
              onClick={handleSaveRoutine}
              disabled={!routineName || routineExercises.length === 0}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exercise Selector */}
      <Dialog open={showExerciseSelector} onOpenChange={setShowExerciseSelector}>
        <DialogContent className="max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Add Exercise</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />
          <div className="space-y-2 overflow-y-auto flex-1">
            {filteredExercises.map(exercise => {
              const category = categories.find(c => c.id === exercise.categoryId);
              const isAdded = routineExercises.some(re => re.exerciseId === exercise.id);
              
              return (
                <Card 
                  key={exercise.id}
                  className={`cursor-pointer transition-colors ${isAdded ? 'opacity-50' : 'hover:bg-accent/50'}`}
                  onClick={() => !isAdded && handleAddExercise(exercise.id)}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <div 
                      className="w-1 h-8 rounded-full" 
                      style={{ backgroundColor: category?.color || 'hsl(var(--muted))' }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">{category?.name}</p>
                    </div>
                    {isAdded && <span className="text-xs text-muted-foreground">Added</span>}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Routine?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this routine. Your workout history will not be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => showDeleteConfirm && handleDeleteRoutine(showDeleteConfirm)}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
