import { useState } from 'react';
import { Plus, Check, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { useFitness } from '@/contexts/FitnessContext';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function ProgressionPlannerPage() {
  const { exercises, progressionPlans, createProgressionPlan } = useFitness();
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    exerciseId: '',
    currentWeight: '',
    currentReps: '5',
    targetWeight: '',
    targetReps: '5',
    weeks: '8',
  });

  const handleCreate = () => {
    if (!formData.exerciseId || !formData.currentWeight || !formData.targetWeight) return;
    
    createProgressionPlan({
      exerciseId: formData.exerciseId,
      currentWeight: parseFloat(formData.currentWeight),
      currentReps: parseInt(formData.currentReps),
      targetWeight: parseFloat(formData.targetWeight),
      targetReps: parseInt(formData.targetReps),
      weeks: parseInt(formData.weeks),
    });
    
    setShowCreate(false);
    setFormData({
      exerciseId: '',
      currentWeight: '',
      currentReps: '5',
      targetWeight: '',
      targetReps: '5',
      weeks: '8',
    });
  };

  return (
    <>
      <Header title="Progression Planner" showBack />
      <PageContainer>
        <div className="space-y-6">
          {/* Info Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                What is the Progression Planner?
              </h3>
              <p className="text-sm text-muted-foreground">
                The Progression Planner maps out a structured workout plan that bridges the gap 
                between your current performance and your target goal. It breaks down the journey 
                into manageable sessions, guiding you from start to finish.
              </p>
            </CardContent>
          </Card>

          {/* Create New Plan */}
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create New Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Progression Plan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Exercise</Label>
                  <Select 
                    value={formData.exerciseId} 
                    onValueChange={(v) => setFormData(p => ({ ...p, exerciseId: v }))}
                  >
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Weight (kg)</Label>
                    <Input
                      type="number"
                      placeholder="60"
                      value={formData.currentWeight}
                      onChange={(e) => setFormData(p => ({ ...p, currentWeight: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Current Reps</Label>
                    <Input
                      type="number"
                      placeholder="5"
                      value={formData.currentReps}
                      onChange={(e) => setFormData(p => ({ ...p, currentReps: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Target Weight (kg)</Label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={formData.targetWeight}
                      onChange={(e) => setFormData(p => ({ ...p, targetWeight: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Target Reps</Label>
                    <Input
                      type="number"
                      placeholder="5"
                      value={formData.targetReps}
                      onChange={(e) => setFormData(p => ({ ...p, targetReps: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Duration (weeks)</Label>
                  <Select 
                    value={formData.weeks} 
                    onValueChange={(v) => setFormData(p => ({ ...p, weeks: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[4, 6, 8, 10, 12, 16].map(w => (
                        <SelectItem key={w} value={w.toString()}>
                          {w} weeks
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="button" onClick={handleCreate} className="w-full">
                  Create Plan
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Existing Plans */}
          {progressionPlans.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Your Plans</h2>
              {progressionPlans.map(plan => {
                const exercise = exercises.find(e => e.id === plan.exerciseId);
                const completedSessions = plan.sessions.filter(s => s.isComplete).length;
                const progress = (completedSessions / plan.sessions.length) * 100;
                
                return (
                  <Card key={plan.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{exercise?.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>{plan.currentWeight}kg × {plan.currentReps}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-primary font-medium">
                          {plan.targetWeight}kg × {plan.targetReps}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Progress</span>
                          <span>{completedSessions} / {plan.sessions.length} sessions</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2">
                        {plan.sessions.slice(0, 8).map((session, i) => (
                          <div
                            key={i}
                            className={cn(
                              "text-xs p-2 rounded text-center",
                              session.isComplete 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted"
                            )}
                          >
                            <div className="font-medium">{session.weight}kg</div>
                            <div className="text-[10px] opacity-80">
                              W{session.week}S{session.session}
                            </div>
                          </div>
                        ))}
                        {plan.sessions.length > 8 && (
                          <div className="text-xs p-2 rounded text-center bg-muted text-muted-foreground">
                            +{plan.sessions.length - 8} more
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No progression plans yet</p>
                <p className="text-sm">Create a plan to start your strength journey</p>
              </CardContent>
            </Card>
          )}
        </div>
      </PageContainer>
    </>
  );
}
