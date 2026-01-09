import { Play, Calendar, TrendingUp, Target, Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { useFitness } from '@/contexts/FitnessContext';
import { format } from 'date-fns';

export default function HomePage() {
  const navigate = useNavigate();
  const { workouts, getActiveWorkout, startWorkout, exercises } = useFitness();
  
  const activeWorkout = getActiveWorkout();
  const recentWorkouts = workouts
    .filter(w => !w.isActive)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const totalWorkouts = workouts.filter(w => !w.isActive).length;
  const totalSets = workouts.reduce((acc, w) => acc + w.sets.length, 0);
  const favoriteExercises = exercises.filter(e => e.isFavorite);

  const handleStartWorkout = () => {
    if (activeWorkout) {
      navigate('/workout');
    } else {
      startWorkout();
      navigate('/workout');
    }
  };

  return (
    <>
      <Header title="FitTrack Pro" />
      <PageContainer>
        <div className="space-y-6">
          {/* Quick Start */}
          <section>
            <Button 
              size="lg" 
              className="w-full h-16 text-lg gap-3"
              onClick={handleStartWorkout}
            >
              <Play className="h-6 w-6" />
              {activeWorkout ? 'Continue Workout' : 'Start Workout'}
            </Button>
          </section>

          {/* Stats Overview */}
          <section className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalWorkouts}</p>
                    <p className="text-xs text-muted-foreground">Workouts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalSets}</p>
                    <p className="text-xs text-muted-foreground">Total Sets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Favorite Exercises */}
          {favoriteExercises.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Favorites</h2>
                <Button variant="link" size="sm" onClick={() => navigate('/exercises')}>
                  View All
                </Button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                {favoriteExercises.slice(0, 6).map(exercise => (
                  <Button 
                    key={exercise.id} 
                    variant="outline" 
                    size="sm"
                    className="shrink-0"
                    onClick={() => navigate(`/exercises/${exercise.id}`)}
                  >
                    {exercise.name}
                  </Button>
                ))}
              </div>
            </section>
          )}

          {/* Recent Workouts */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Recent Workouts</h2>
              <Button variant="link" size="sm" onClick={() => navigate('/history')}>
                View All
              </Button>
            </div>
            {recentWorkouts.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No workouts yet</p>
                  <p className="text-sm">Start your first workout to track progress!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {recentWorkouts.map(workout => (
                  <Card 
                    key={workout.id} 
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => navigate(`/history/${workout.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {format(new Date(workout.date), 'EEEE, MMM d')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {workout.sets.length} sets
                          </p>
                        </div>
                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section className="grid grid-cols-2 gap-4">
            <Card 
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate('/tools/calculator')}
            >
              <CardContent className="p-4 text-center">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium">1RM Calculator</p>
              </CardContent>
            </Card>
            <Card 
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate('/tools/progression')}
            >
              <CardContent className="p-4 text-center">
                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-2">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium">Progression Planner</p>
              </CardContent>
            </Card>
          </section>
        </div>
      </PageContainer>
    </>
  );
}
