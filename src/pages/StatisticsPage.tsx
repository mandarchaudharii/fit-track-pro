import { useMemo } from 'react';
import { format, subDays, startOfWeek, eachWeekOfInterval } from 'date-fns';
import { BarChart3, TrendingUp, Dumbbell, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { useFitness } from '@/contexts/FitnessContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

export default function StatisticsPage() {
  const { workouts, exercises, categories, getStatistics } = useFitness();
  
  const stats = getStatistics();
  const completedWorkouts = workouts.filter(w => !w.isActive);

  // Weekly volume data (last 8 weeks)
  const weeklyData = useMemo(() => {
    const weeks = eachWeekOfInterval({
      start: subDays(new Date(), 56),
      end: new Date(),
    });

    return weeks.map(weekStart => {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekWorkouts = completedWorkouts.filter(w => {
        const date = new Date(w.date);
        return date >= weekStart && date <= weekEnd;
      });
      
      const volume = weekWorkouts.reduce((acc, w) => 
        acc + w.sets.reduce((setAcc, s) => 
          setAcc + ((s.weight || 0) * (s.reps || 0)), 0
        ), 0
      );

      return {
        week: format(weekStart, 'MM/dd'),
        workouts: weekWorkouts.length,
        volume: Math.round(volume),
        sets: weekWorkouts.reduce((acc, w) => acc + w.sets.length, 0),
      };
    });
  }, [completedWorkouts]);

  // Category distribution
  const categoryData = useMemo(() => {
    const distribution: Record<string, { name: string; value: number; color: string }> = {};
    
    completedWorkouts.forEach(w => {
      w.sets.forEach(s => {
        const exercise = exercises.find(e => e.id === s.exerciseId);
        if (exercise) {
          const category = categories.find(c => c.id === exercise.categoryId);
          if (category) {
            if (!distribution[category.id]) {
              distribution[category.id] = { 
                name: category.name, 
                value: 0, 
                color: category.color 
              };
            }
            distribution[category.id].value += 1;
          }
        }
      });
    });
    
    return Object.values(distribution).sort((a, b) => b.value - a.value);
  }, [completedWorkouts, exercises, categories]);

  // Workout frequency (last 30 days)
  const frequencyData = useMemo(() => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const hasWorkout = completedWorkouts.some(w => w.date === dateStr);
      days.push({
        date: format(date, 'MM/dd'),
        value: hasWorkout ? 1 : 0,
      });
    }
    return days;
  }, [completedWorkouts]);

  // Average workout duration
  const avgDuration = useMemo(() => {
    const durations = completedWorkouts
      .filter(w => w.endTime)
      .map(w => {
        const start = new Date(w.startTime);
        const end = new Date(w.endTime!);
        return (end.getTime() - start.getTime()) / 1000 / 60; // minutes
      });
    
    if (durations.length === 0) return 0;
    return Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
  }, [completedWorkouts]);

  // Current streak
  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      const hasWorkout = completedWorkouts.some(w => w.date === date);
      if (hasWorkout) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  }, [completedWorkouts]);

  return (
    <>
      <Header title="Statistics" showBack />
      <PageContainer>
        <div className="space-y-4">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalWorkouts}</p>
                    <p className="text-xs text-muted-foreground">Total Workouts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Flame className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{currentStreak}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalSets}</p>
                    <p className="text-xs text-muted-foreground">Total Sets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{avgDuration}m</p>
                    <p className="text-xs text-muted-foreground">Avg Duration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Volume Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Weekly Volume (kg)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Bar 
                      dataKey="volume" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          {categoryData.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Muscle Group Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {categoryData.slice(0, 6).map(cat => (
                    <div key={cat.name} className="flex items-center gap-1 text-xs">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: cat.color }}
                      />
                      <span>{cat.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Workout Frequency */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Last 30 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-1">
                {frequencyData.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square rounded-sm ${
                      day.value ? 'bg-primary' : 'bg-muted'
                    }`}
                    title={day.date}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {frequencyData.filter(d => d.value).length} workouts in the last 30 days
              </p>
            </CardContent>
          </Card>

          {/* Weekly Workouts Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Weekly Workouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" fontSize={10} />
                    <YAxis fontSize={10} allowDecimals={false} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="workouts" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
