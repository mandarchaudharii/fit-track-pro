import { Star, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Exercise, Category } from '@/types/fitness';
import { cn } from '@/lib/utils';

interface ExerciseCardProps {
  exercise: Exercise;
  category?: Category;
  onSelect?: () => void;
  onFavorite?: () => void;
  showArrow?: boolean;
}

export function ExerciseCard({ exercise, category, onSelect, onFavorite, showArrow = true }: ExerciseCardProps) {
  return (
    <Card 
      className="flex items-center p-3 gap-3 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={onSelect}
    >
      <div 
        className="w-1 h-10 rounded-full" 
        style={{ backgroundColor: category?.color || 'hsl(var(--muted))' }}
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{exercise.name}</p>
        <p className="text-sm text-muted-foreground">{category?.name || 'Uncategorized'}</p>
      </div>
      <div className="flex items-center gap-1">
        {onFavorite && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onFavorite();
            }}
          >
            <Star className={cn(
              "h-4 w-4",
              exercise.isFavorite && "fill-primary text-primary"
            )} />
          </Button>
        )}
        {showArrow && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </div>
    </Card>
  );
}
