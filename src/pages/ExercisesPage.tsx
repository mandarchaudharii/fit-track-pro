import { useState } from 'react';
import { Plus, Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { ExerciseCard } from '@/components/workout/ExerciseCard';
import { useFitness } from '@/contexts/FitnessContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ExercisesPage() {
  const navigate = useNavigate();
  const { exercises, categories, addExercise, toggleFavorite } = useFitness();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: '',
    categoryId: '',
    type: 'weight' as const,
  });

  const filteredExercises = exercises.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteExercises = filteredExercises.filter(e => e.isFavorite);

  const handleAddExercise = () => {
    if (!newExercise.name || !newExercise.categoryId) return;
    addExercise({
      name: newExercise.name,
      categoryId: newExercise.categoryId,
      type: newExercise.type,
      isFavorite: false,
    });
    setShowAddDialog(false);
    setNewExercise({ name: '', categoryId: '', type: 'weight' });
  };

  return (
    <>
      <Header 
        title="Exercises" 
        showBack
        rightContent={
          <Button size="icon" variant="ghost" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-5 w-5" />
          </Button>
        }
      />
      <PageContainer>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="all">
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="favorites" className="flex-1">
                <Star className="h-4 w-4 mr-1" />
                Favorites
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-2 mt-4">
              {categories.map(category => {
                const categoryExercises = filteredExercises.filter(
                  e => e.categoryId === category.id
                );
                if (categoryExercises.length === 0) return null;

                return (
                  <div key={category.id}>
                    <h3 
                      className="text-sm font-medium mb-2 px-1"
                      style={{ color: category.color }}
                    >
                      {category.name}
                    </h3>
                    <div className="space-y-2">
                      {categoryExercises.map(exercise => (
                        <ExerciseCard
                          key={exercise.id}
                          exercise={exercise}
                          category={category}
                          onSelect={() => navigate(`/exercises/${exercise.id}`)}
                          onFavorite={() => toggleFavorite(exercise.id)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-2 mt-4">
              {favoriteExercises.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Star className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No favorite exercises yet</p>
                  <p className="text-sm">Tap the star icon to add favorites</p>
                </div>
              ) : (
                favoriteExercises.map(exercise => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    category={categories.find(c => c.id === exercise.categoryId)}
                    onSelect={() => navigate(`/exercises/${exercise.id}`)}
                    onFavorite={() => toggleFavorite(exercise.id)}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Exercise</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Exercise name"
                value={newExercise.name}
                onChange={(e) => setNewExercise(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={newExercise.categoryId}
                onValueChange={(v) => setNewExercise(p => ({ ...p, categoryId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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
              <Label>Type</Label>
              <Select
                value={newExercise.type}
                onValueChange={(v: any) => setNewExercise(p => ({ ...p, type: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight">Weight & Reps</SelectItem>
                  <SelectItem value="bodyweight">Bodyweight</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddExercise} className="w-full">
              Add Exercise
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
