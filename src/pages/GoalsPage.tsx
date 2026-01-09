import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Target, Trophy, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFitness } from '@/contexts/FitnessContext';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

export default function GoalsPage() {
  const { toast } = useToast();
  const { 
    goals, 
    exercises, 
    getPersonalRecords,
    addGoal,
    completeGoal,
    deleteGoal,
  } = useFitness();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [targetType, setTargetType] = useState<'weight' | 'reps' | '1RM'>('weight');
  const [targetValue, setTargetValue] = useState('');
  const [deadline, setDeadline] = useState('');

  const activeGoals = goals.filter(g => !g.isComplete);
  const completedGoals = goals.filter(g => g.isComplete);

  const getProgress = (goal: typeof goals[0]) => {
    const prs = getPersonalRecords(goal.exerciseId);
    let currentValue = 0;
    
    if (goal.targetType === 'weight') {
      currentValue = prs.find(p => p.type === 'weight')?.value || 0;
    } else if (goal.targetType === 'reps') {
      currentValue = prs.find(p => p.type === 'reps')?.value || 0;
    } else if (goal.targetType === '1RM') {
      currentValue = prs.find(p => p.type === 'estimated1RM')?.value || 0;
    }
    
    return Math.min(100, (currentValue / goal.targetValue) * 100);
  };

  const handleAddGoal = () => {
    if (!selectedExercise || !targetValue) return;
    
    addGoal({
      exerciseId: selectedExercise,
      targetType,
      targetValue: parseFloat(targetValue),
      deadline: deadline || undefined,
    });
    
    setShowAddDialog(false);
    setSelectedExercise('');
    setTargetValue('');
    setDeadline('');
    toast({ title: 'Goal created' });
  };

  const handleCompleteGoal = (goalId: string) => {
    completeGoal(goalId);
    toast({ title: 'Goal marked as complete! 🎉' });
  };

  const handleDeleteGoal = (goalId: string) => {
    deleteGoal(goalId);
    setShowDeleteConfirm(null);
    toast({ title: 'Goal deleted' });
  };

  const getExerciseName = (exerciseId: string) => {
    return exercises.find(e => e.id === exerciseId)?.name || 'Unknown';
  };

  const getTargetLabel = (type: string) => {
    switch (type) {
      case 'weight': return 'kg';
      case 'reps': return 'reps';
      case '1RM': return 'kg (1RM)';
      default: return '';
    }
  };

  return (
    <>
      <Header 
        title="Goals" 
        showBack
        rightContent={
          <Button variant="ghost" size="icon" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-5 w-5" />
          </Button>
        }
      />
      <PageContainer>
        <Tabs defaultValue="active">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="active" className="flex-1 gap-2">
              <Target className="h-4 w-4" />
              Active ({activeGoals.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1 gap-2">
              <Trophy className="h-4 w-4" />
              Completed ({completedGoals.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-3">
            {activeGoals.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No active goals</p>
                  <p className="text-sm">Set a goal to stay motivated</p>
                  <Button 
                    className="mt-4"
                    onClick={() => setShowAddDialog(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activeGoals.map(goal => {
                const progress = getProgress(goal);
                const isAchieved = progress >= 100;
                
                return (
                  <Card key={goal.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{getExerciseName(goal.exerciseId)}</p>
                          <p className="text-sm text-muted-foreground">
                            Target: {goal.targetValue} {getTargetLabel(goal.targetType)}
                          </p>
                          {goal.deadline && (
                            <p className="text-xs text-muted-foreground">
                              Deadline: {format(new Date(goal.deadline), 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {isAchieved && (
                            <Button
                              variant="default"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleCompleteGoal(goal.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setShowDeleteConfirm(goal.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1 text-right">
                        {Math.round(progress)}%
                      </p>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3">
            {completedGoals.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No completed goals yet</p>
                  <p className="text-sm">Keep working towards your goals!</p>
                </CardContent>
              </Card>
            ) : (
              completedGoals.map(goal => (
                <Card key={goal.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Trophy className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{getExerciseName(goal.exerciseId)}</p>
                          <p className="text-sm text-muted-foreground">
                            {goal.targetValue} {getTargetLabel(goal.targetType)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setShowDeleteConfirm(goal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </PageContainer>

      {/* Add Goal Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Exercise</Label>
              <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exercise" />
                </SelectTrigger>
                <SelectContent>
                  {exercises.filter(e => e.type === 'weight').map(exercise => (
                    <SelectItem key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Goal Type</Label>
              <Select value={targetType} onValueChange={(v) => setTargetType(v as typeof targetType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight">Max Weight (kg)</SelectItem>
                  <SelectItem value="reps">Max Reps</SelectItem>
                  <SelectItem value="1RM">Estimated 1RM (kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Value</Label>
              <Input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder={`Enter target ${getTargetLabel(targetType)}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Deadline (optional)</Label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddGoal} disabled={!selectedExercise || !targetValue}>
              Add Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this goal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => showDeleteConfirm && handleDeleteGoal(showDeleteConfirm)}
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
