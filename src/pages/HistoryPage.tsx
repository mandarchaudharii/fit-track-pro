import { useState } from 'react';
import { Calendar, List, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFitness } from '@/contexts/FitnessContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { workouts, exercises, categories } = useFitness();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const completedWorkouts = workouts
    .filter(w => !w.isActive)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const workoutDates = new Set(completedWorkouts.map(w => w.date));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getExercisesForWorkout = (workout: typeof workouts[0]) => {
    const exerciseIds = [...new Set(workout.sets.map(s => s.exerciseId))];
    return exerciseIds.map(id => exercises.find(e => e.id === id)).filter(Boolean);
  };

  return (
    <>
      <Header title="History" />
      <PageContainer>
        <Tabs defaultValue="list">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="list" className="flex-1 gap-2">
              <List className="h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex-1 gap-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-3">
            {completedWorkouts.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No workout history yet</p>
                  <p className="text-sm">Complete a workout to see it here</p>
                </CardContent>
              </Card>
            ) : (
              completedWorkouts.map(workout => {
                const workoutExercises = getExercisesForWorkout(workout);
                return (
                  <Card 
                    key={workout.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => navigate(`/history/${workout.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-semibold">
                            {format(new Date(workout.date), 'EEEE, MMMM d, yyyy')}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {workout.sets.length} sets · {workoutExercises.length} exercises
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {workoutExercises.slice(0, 3).map(exercise => {
                              const category = categories.find(c => c.id === exercise?.categoryId);
                              return (
                                <span
                                  key={exercise?.id}
                                  className="text-xs px-2 py-0.5 rounded-full"
                                  style={{ 
                                    backgroundColor: category?.color ? `${category.color}20` : undefined,
                                    color: category?.color
                                  }}
                                >
                                  {exercise?.name}
                                </span>
                              );
                            })}
                            {workoutExercises.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{workoutExercises.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                  >
                    ←
                  </Button>
                  <span className="font-semibold">
                    {format(currentMonth, 'MMMM yyyy')}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                  >
                    →
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="py-2 text-muted-foreground font-medium">
                      {day}
                    </div>
                  ))}
                  
                  {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  
                  {daysInMonth.map(day => {
                    const dateStr = format(day, 'yyyy-MM-dd');
                    const hasWorkout = workoutDates.has(dateStr);
                    const isToday = isSameDay(day, new Date());
                    
                    return (
                      <div
                        key={dateStr}
                        className={`
                          py-2 rounded-full relative cursor-pointer transition-colors
                          ${hasWorkout ? 'bg-primary text-primary-foreground' : ''}
                          ${isToday && !hasWorkout ? 'ring-2 ring-primary' : ''}
                          ${!hasWorkout ? 'hover:bg-accent' : ''}
                        `}
                        onClick={() => {
                          if (hasWorkout) {
                            const workout = completedWorkouts.find(w => w.date === dateStr);
                            if (workout) navigate(`/history/${workout.id}`);
                          }
                        }}
                      >
                        {format(day, 'd')}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
}
