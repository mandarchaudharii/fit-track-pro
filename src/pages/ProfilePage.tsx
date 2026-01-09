import { User, Dumbbell, Scale, Settings, ChevronRight, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { useFitness } from '@/contexts/FitnessContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { workouts, exercises } = useFitness();

  const totalWorkouts = workouts.filter(w => !w.isActive).length;
  const totalSets = workouts.reduce((acc, w) => acc + w.sets.length, 0);
  const totalExercises = exercises.length;

  const handleClearData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const menuItems = [
    {
      icon: Dumbbell,
      label: 'Exercises',
      description: 'Manage your exercise library',
      path: '/exercises',
    },
    {
      icon: Scale,
      label: 'Body Tracker',
      description: 'Track body measurements',
      path: '/body-tracker',
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'App preferences',
      path: '/settings',
    },
  ];

  return (
    <>
      <Header title="Profile" />
      <PageContainer>
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Athlete</h2>
                  <p className="text-sm text-muted-foreground">
                    Tracking progress locally
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{totalWorkouts}</p>
                <p className="text-xs text-muted-foreground">Workouts</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{totalSets}</p>
                <p className="text-xs text-muted-foreground">Sets</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{totalExercises}</p>
                <p className="text-xs text-muted-foreground">Exercises</p>
              </CardContent>
            </Card>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            {menuItems.map(item => (
              <Card 
                key={item.path}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => navigate(item.path)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-muted">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardContent className="p-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your workout history, exercises, 
                      and settings. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearData}>
                      Delete Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
