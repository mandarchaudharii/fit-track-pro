import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Star, Trash2, Edit, TrendingUp, History, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFitness } from '@/contexts/FitnessContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    exercises, 
    categories, 
    getExerciseHistory, 
    getPersonalRecords,
    updateExercise,
    deleteExercise,
    toggleFavorite,
  } = useFitness();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const exercise = exercises.find(e => e.id === id);
  const category = categories.find(c => c.id === exercise?.categoryId);
  const history = id ? getExerciseHistory(id) : [];
  const prs = id ? getPersonalRecords(id) : [];

  if (!exercise) {
    return (
      <>
        <Header title="Exercise" showBack />
        <PageContainer>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Exercise not found</p>
          </div>
        </PageContainer>
      </>
    );
  }

  // Prepare chart data
  const chartData = history
    .slice(0, 20)
    .reverse()
    .map(h => {
      const maxWeight = Math.max(...h.sets.map(s => s.weight || 0));
      const maxReps = Math.max(...h.sets.map(s => s.reps || 0));
      return {
        date: format(new Date(h.workout.date), 'MM/dd'),
        weight: maxWeight,
        reps: maxReps,
      };
    });

  const handleDelete = () => {
    deleteExercise(exercise.id);
    navigate('/exercises');
    toast({ title: 'Exercise deleted' });
  };

  const handleEdit = () => {
    setEditName(exercise.name);
    setEditCategory(exercise.categoryId);
    setEditNotes(exercise.notes || '');
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    updateExercise(exercise.id, {
      name: editName,
      categoryId: editCategory,
      notes: editNotes,
    });
    setShowEditDialog(false);
    toast({ title: 'Exercise updated' });
  };

  const getPRValue = (type: string) => {
    const pr = prs.find(p => p.type === type);
    return pr?.value;
  };

  return (
    <>
      <Header 
        title={exercise.name}
        showBack
        rightContent={
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => toggleFavorite(exercise.id)}
          >
            <Star className={exercise.isFavorite ? "fill-primary text-primary h-5 w-5" : "h-5 w-5"} />
          </Button>
        }
        actions={[
          { label: 'Edit', onClick: handleEdit },
          { label: 'Delete', onClick: () => setShowDeleteConfirm(true) },
        ]}
      />
      <PageContainer>
        <div className="space-y-4">
          {/* Info Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-2 h-8 rounded-full" 
                  style={{ backgroundColor: category?.color || 'hsl(var(--muted))' }}
                />
                <div>
                  <p className="font-semibold">{category?.name || 'Uncategorized'}</p>
                  <p className="text-sm text-muted-foreground capitalize">{exercise.type}</p>
                </div>
              </div>
              {exercise.notes && (
                <p className="text-sm text-muted-foreground">{exercise.notes}</p>
              )}
            </CardContent>
          </Card>

          {/* Personal Records */}
          {prs.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  Personal Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {getPRValue('weight') && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Max Weight</p>
                      <p className="text-lg font-bold">{getPRValue('weight')} kg</p>
                    </div>
                  )}
                  {getPRValue('reps') && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Max Reps</p>
                      <p className="text-lg font-bold">{getPRValue('reps')}</p>
                    </div>
                  )}
                  {getPRValue('estimated1RM') && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Est. 1RM</p>
                      <p className="text-lg font-bold">{getPRValue('estimated1RM')} kg</p>
                    </div>
                  )}
                  {getPRValue('volume') && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground">Max Volume</p>
                      <p className="text-lg font-bold">{getPRValue('volume')} kg</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="history">
            <TabsList className="w-full">
              <TabsTrigger value="history" className="flex-1 gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex-1 gap-2">
                <TrendingUp className="h-4 w-4" />
                Progress
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="space-y-3 mt-4">
              {history.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No history yet</p>
                    <p className="text-sm">Log this exercise in a workout to see history</p>
                  </CardContent>
                </Card>
              ) : (
                history.map(h => (
                  <Card 
                    key={h.workout.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => navigate(`/history/${h.workout.id}`)}
                  >
                    <CardContent className="p-4">
                      <p className="font-medium mb-2">
                        {format(new Date(h.workout.date), 'EEEE, MMMM d, yyyy')}
                      </p>
                      <div className="space-y-1">
                        {h.sets.map((set, index) => (
                          <p key={set.id} className="text-sm text-muted-foreground">
                            Set {index + 1}: {set.weight} kg × {set.reps}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="progress" className="mt-4">
              {chartData.length < 2 ? (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Not enough data</p>
                    <p className="text-sm">Log more workouts to see progress</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Weight Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" fontSize={12} />
                          <YAxis fontSize={12} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="weight" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            dot={{ fill: 'hsl(var(--primary))' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Exercise?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the exercise from your library. Workout history will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Exercise</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={editCategory} onValueChange={setEditCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add notes about this exercise..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
