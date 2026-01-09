import { Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WorkoutSet } from '@/types/fitness';
import { cn } from '@/lib/utils';

interface SetRowProps {
  set: WorkoutSet;
  index: number;
  onUpdate: (updates: Partial<WorkoutSet>) => void;
  onDelete: () => void;
  onComplete: () => void;
  exerciseType: 'weight' | 'bodyweight' | 'duration' | 'distance';
}

export function SetRow({ set, index, onUpdate, onDelete, onComplete, exerciseType }: SetRowProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 py-2 px-3 rounded-lg transition-colors",
      set.isComplete ? "bg-primary/10" : "bg-muted/50"
    )}>
      <span className="w-8 text-center text-sm font-medium text-muted-foreground">
        {index + 1}
      </span>
      
      {(exerciseType === 'weight' || exerciseType === 'bodyweight') && (
        <>
          <Input
            type="number"
            placeholder="kg"
            value={set.weight || ''}
            onChange={(e) => onUpdate({ weight: parseFloat(e.target.value) || undefined })}
            className="w-20 text-center h-9"
          />
          <span className="text-muted-foreground">×</span>
          <Input
            type="number"
            placeholder="reps"
            value={set.reps || ''}
            onChange={(e) => onUpdate({ reps: parseInt(e.target.value) || undefined })}
            className="w-20 text-center h-9"
          />
        </>
      )}
      
      {exerciseType === 'duration' && (
        <Input
          type="number"
          placeholder="seconds"
          value={set.duration || ''}
          onChange={(e) => onUpdate({ duration: parseInt(e.target.value) || undefined })}
          className="w-32 text-center h-9"
        />
      )}
      
      {exerciseType === 'distance' && (
        <Input
          type="number"
          placeholder="meters"
          value={set.distance || ''}
          onChange={(e) => onUpdate({ distance: parseFloat(e.target.value) || undefined })}
          className="w-32 text-center h-9"
        />
      )}
      
      <div className="flex-1" />
      
      <Button
        variant={set.isComplete ? "default" : "outline"}
        size="icon"
        className="h-9 w-9"
        onClick={onComplete}
      >
        <Check className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-destructive hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
