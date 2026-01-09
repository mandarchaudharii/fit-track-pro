import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, differenceInMinutes } from 'date-fns';
import { Trash2, Copy, Calendar, Share2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { useFitness } from '@/contexts/FitnessContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    getWorkoutById, 
    exercises, 
    categories, 
    deleteWorkout, 
    copyWorkout,
    moveWorkout,
    updateWorkout,
  } = useFitness();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [comment, setComment] = useState('');

  const workout = id ? getWorkoutById(id) : null;

  if (!workout) {
    return (
      <>
        <Header title="Workout" showBack />
        <PageContainer>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Workout not found</p>
          </div>
        </PageContainer>
      </>
    );
  }

  const duration = workout.endTime 
    ? differenceInMinutes(new Date(workout.endTime), new Date(workout.startTime))
    : 0;

  const groupedSets = workout.sets.reduce((acc, set) => {
    if (!acc[set.exerciseId]) {
      acc[set.exerciseId] = [];
    }
    acc[set.exerciseId].push(set);
    return acc;
  }, {} as Record<string, typeof workout.sets>);

  const handleDelete = () => {
    deleteWorkout(workout.id);
    navigate('/history');
    toast({ title: 'Workout deleted' });
  };

  const handleCopy = () => {
    const newWorkout = copyWorkout(workout.id);
    if (newWorkout) {
      navigate('/workout');
      toast({ title: 'Workout copied and started' });
    }
  };

  const handleMove = () => {
    if (newDate) {
      moveWorkout(workout.id, newDate);
      setShowMoveDialog(false);
      toast({ title: 'Workout moved' });
    }
  };

  const handleSaveComment = () => {
    updateWorkout(workout.id, { comment });
    setShowCommentDialog(false);
    toast({ title: 'Comment saved' });
  };

  const handleShare = async () => {
    const exerciseNames = [...new Set(workout.sets.map(s => {
      const ex = exercises.find(e => e.id === s.exerciseId);
      return ex?.name || 'Unknown';
    }))];
    
    const shareText = `Workout on ${format(new Date(workout.date), 'MMMM d, yyyy')}
Duration: ${duration} minutes
${workout.sets.length} sets across ${exerciseNames.length} exercises
Exercises: ${exerciseNames.join(', ')}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Workout',
          text: shareText,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({ title: 'Copied to clipboard' });
    }
  };

  return (
    <>
      <Header 
        title={format(new Date(workout.date), 'EEEE, MMM d')}
        showBack
        actions={[
          { label: 'Delete', onClick: () => setShowDeleteConfirm(true) },
        ]}
      />
      <PageContainer>
        <div className="space-y-4">
          {/* Summary Card */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{duration}</p>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{workout.sets.length}</p>
                  <p className="text-xs text-muted-foreground">Sets</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{Object.keys(groupedSets).length}</p>
                  <p className="text-xs text-muted-foreground">Exercises</p>
                </div>
              </div>
              {workout.comment && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm">{workout.comment}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" size="sm" className="flex-col h-auto py-2" onClick={handleCopy}>
              <Copy className="h-4 w-4 mb-1" />
              <span className="text-xs">Copy</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-col h-auto py-2" onClick={() => {
              setNewDate(workout.date);
              setShowMoveDialog(true);
            }}>
              <Calendar className="h-4 w-4 mb-1" />
              <span className="text-xs">Move</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-col h-auto py-2" onClick={() => {
              setComment(workout.comment || '');
              setShowCommentDialog(true);
            }}>
              <MessageSquare className="h-4 w-4 mb-1" />
              <span className="text-xs">Comment</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-col h-auto py-2" onClick={handleShare}>
              <Share2 className="h-4 w-4 mb-1" />
              <span className="text-xs">Share</span>
            </Button>
          </div>

          {/* Exercise Details */}
          {Object.entries(groupedSets).map(([exerciseId, sets]) => {
            const exercise = exercises.find(e => e.id === exerciseId);
            const category = categories.find(c => c.id === exercise?.categoryId);
            
            return (
              <Card key={exerciseId}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-1 h-6 rounded-full" 
                      style={{ backgroundColor: category?.color || 'hsl(var(--muted))' }}
                    />
                    <CardTitle className="text-base">{exercise?.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {sets.map((set, index) => (
                      <div key={set.id} className="flex items-center gap-3 text-sm py-1">
                        <span className="w-6 text-muted-foreground">{index + 1}</span>
                        {set.weight !== undefined && set.reps !== undefined && (
                          <span>{set.weight} kg × {set.reps}</span>
                        )}
                        {set.duration !== undefined && (
                          <span>{set.duration} seconds</span>
                        )}
                        {set.distance !== undefined && (
                          <span>{set.distance} m</span>
                        )}
                        {set.comment && (
                          <span className="text-muted-foreground text-xs ml-auto">
                            {set.comment}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </PageContainer>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workout?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All sets from this workout will be permanently deleted.
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

      {/* Move Dialog */}
      <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move Workout</DialogTitle>
          </DialogHeader>
          <Input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMoveDialog(false)}>Cancel</Button>
            <Button onClick={handleMove}>Move</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog open={showCommentDialog} onOpenChange={setShowCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Workout Comment</DialogTitle>
          </DialogHeader>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a note about this workout..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommentDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveComment}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
