import { useMemo } from 'react';
import { format } from 'date-fns';
import { Trophy, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFitness } from '@/contexts/FitnessContext';
import { Badge } from '@/components/ui/badge';

export default function PersonalRecordsPage() {
  const { personalRecords, exercises, categories } = useFitness();

  const groupedRecords = useMemo(() => {
    const grouped: Record<string, typeof personalRecords> = {};
    
    personalRecords.forEach(pr => {
      if (!grouped[pr.exerciseId]) {
        grouped[pr.exerciseId] = [];
      }
      grouped[pr.exerciseId].push(pr);
    });
    
    return grouped;
  }, [personalRecords]);

  const recentRecords = useMemo(() => {
    return [...personalRecords]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  }, [personalRecords]);

  const getRecordLabel = (type: string) => {
    switch (type) {
      case 'weight': return 'Max Weight';
      case 'reps': return 'Max Reps';
      case 'estimated1RM': return 'Est. 1RM';
      case 'volume': return 'Max Volume';
      default: return type;
    }
  };

  const getRecordUnit = (type: string) => {
    switch (type) {
      case 'weight': return 'kg';
      case 'reps': return 'reps';
      case 'estimated1RM': return 'kg';
      case 'volume': return 'kg';
      default: return '';
    }
  };

  const exercisesWithRecords = exercises.filter(e => groupedRecords[e.id]);

  return (
    <>
      <Header title="Personal Records" showBack />
      <PageContainer>
        <Tabs defaultValue="all">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="all" className="flex-1">All PRs</TabsTrigger>
            <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {exercisesWithRecords.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No personal records yet</p>
                  <p className="text-sm">Complete workouts to set your first PRs</p>
                </CardContent>
              </Card>
            ) : (
              exercisesWithRecords.map(exercise => {
                const records = groupedRecords[exercise.id] || [];
                const category = categories.find(c => c.id === exercise.categoryId);
                
                return (
                  <Card key={exercise.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-1 h-6 rounded-full" 
                          style={{ backgroundColor: category?.color || 'hsl(var(--muted))' }}
                        />
                        <CardTitle className="text-base">{exercise.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        {records.map(pr => (
                          <div 
                            key={`${pr.exerciseId}-${pr.type}`}
                            className="p-3 bg-muted rounded-lg"
                          >
                            <div className="flex items-center gap-1 mb-1">
                              <Trophy className="h-3 w-3 text-primary" />
                              <span className="text-xs text-muted-foreground">
                                {getRecordLabel(pr.type)}
                              </span>
                            </div>
                            <p className="text-lg font-bold">
                              {pr.value} {getRecordUnit(pr.type)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(pr.date), 'MMM d, yyyy')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-3">
            {recentRecords.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No recent records</p>
                </CardContent>
              </Card>
            ) : (
              recentRecords.map((pr, index) => {
                const exercise = exercises.find(e => e.id === pr.exerciseId);
                const category = categories.find(c => c.id === exercise?.categoryId);
                
                return (
                  <Card key={`${pr.exerciseId}-${pr.type}-${index}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Trophy className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{exercise?.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {getRecordLabel(pr.type)}: {pr.value} {getRecordUnit(pr.type)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {format(new Date(pr.date), 'MMM d')}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
}
