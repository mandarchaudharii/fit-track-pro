import { useState } from 'react';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFitness } from '@/contexts/FitnessContext';
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

const PRESET_COLORS = [
  'hsl(0, 70%, 50%)',    // Red
  'hsl(30, 70%, 50%)',   // Orange
  'hsl(45, 70%, 50%)',   // Yellow
  'hsl(120, 70%, 50%)',  // Green
  'hsl(180, 70%, 50%)',  // Cyan
  'hsl(210, 70%, 50%)',  // Blue
  'hsl(280, 70%, 50%)',  // Purple
  'hsl(330, 70%, 50%)',  // Pink
];

export default function CategoriesPage() {
  const { toast } = useToast();
  const { 
    categories, 
    exercises,
    addCategory, 
    updateCategory, 
    deleteCategory,
  } = useFitness();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState(PRESET_COLORS[0]);

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  const getExerciseCount = (categoryId: string) => {
    return exercises.filter(e => e.categoryId === categoryId).length;
  };

  const handleAddCategory = () => {
    if (!categoryName) return;
    
    addCategory({
      name: categoryName,
      color: categoryColor,
    });
    
    setShowAddDialog(false);
    setCategoryName('');
    setCategoryColor(PRESET_COLORS[0]);
    toast({ title: 'Category created' });
  };

  const handleEditCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    setEditingCategory(categoryId);
    setCategoryName(category.name);
    setCategoryColor(category.color);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (!editingCategory || !categoryName) return;
    
    updateCategory(editingCategory, {
      name: categoryName,
      color: categoryColor,
    });
    
    setShowEditDialog(false);
    setEditingCategory(null);
    setCategoryName('');
    setCategoryColor(PRESET_COLORS[0]);
    toast({ title: 'Category updated' });
  };

  const handleDeleteCategory = (categoryId: string) => {
    const exerciseCount = getExerciseCount(categoryId);
    if (exerciseCount > 0) {
      toast({ 
        title: 'Cannot delete category',
        description: `This category has ${exerciseCount} exercises. Move or delete them first.`,
        variant: 'destructive',
      });
      setShowDeleteConfirm(null);
      return;
    }
    
    deleteCategory(categoryId);
    setShowDeleteConfirm(null);
    toast({ title: 'Category deleted' });
  };

  const CategoryForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="e.g., Chest"
        />
      </div>
      <div className="space-y-2">
        <Label>Color</Label>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_COLORS.map(color => (
            <button
              key={color}
              className={`w-full h-10 rounded-lg transition-all ${
                categoryColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setCategoryColor(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header 
        title="Categories" 
        showBack
        rightContent={
          <Button variant="ghost" size="icon" onClick={() => setShowAddDialog(true)}>
            <Plus className="h-5 w-5" />
          </Button>
        }
      />
      <PageContainer>
        <div className="space-y-2">
          {sortedCategories.map((category, index) => (
            <Card key={category.id}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getExerciseCount(category.id)} exercises
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditCategory(category.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowDeleteConfirm(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageContainer>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <CategoryForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddCategory} disabled={!categoryName}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <CategoryForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={!categoryName}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this category. Make sure there are no exercises using it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => showDeleteConfirm && handleDeleteCategory(showDeleteConfirm)}
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
