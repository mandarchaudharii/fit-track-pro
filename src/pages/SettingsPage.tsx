import { useState } from 'react';
import { Download, Upload, Trash2, Moon, Bell, Vibrate, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useFitness } from '@/contexts/FitnessContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

export default function SettingsPage() {
  const { toast } = useToast();
  const { 
    settings, 
    updateSettings, 
    clearAllData,
    workouts,
    exercises,
    categories,
    routines,
    measurements,
    measurementEntries,
    progressionPlans,
    goals,
    personalRecords,
  } = useFitness();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      workouts,
      exercises,
      categories,
      routines,
      measurements,
      measurementEntries,
      progressionPlans,
      goals,
      personalRecords,
      settings,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fittrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Data exported successfully' });
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data structure
        if (!data.version || !data.exercises) {
          throw new Error('Invalid backup file');
        }

        // Import data to localStorage
        if (data.workouts) localStorage.setItem('fittrack-workouts', JSON.stringify(data.workouts));
        if (data.exercises) localStorage.setItem('fittrack-exercises', JSON.stringify(data.exercises));
        if (data.categories) localStorage.setItem('fittrack-categories', JSON.stringify(data.categories));
        if (data.routines) localStorage.setItem('fittrack-routines', JSON.stringify(data.routines));
        if (data.measurements) localStorage.setItem('fittrack-measurements', JSON.stringify(data.measurements));
        if (data.measurementEntries) localStorage.setItem('fittrack-measurement-entries', JSON.stringify(data.measurementEntries));
        if (data.progressionPlans) localStorage.setItem('fittrack-progressions', JSON.stringify(data.progressionPlans));
        if (data.goals) localStorage.setItem('fittrack-goals', JSON.stringify(data.goals));
        if (data.personalRecords) localStorage.setItem('fittrack-prs', JSON.stringify(data.personalRecords));
        if (data.settings) localStorage.setItem('fittrack-settings', JSON.stringify(data.settings));

        toast({ title: 'Data imported successfully. Please refresh the page.' });
        
        // Reload to apply changes
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        toast({ 
          title: 'Import failed', 
          description: 'Invalid backup file format',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    clearAllData();
    setShowClearConfirm(false);
    toast({ title: 'All data cleared' });
  };

  return (
    <>
      <Header title="Settings" showBack />
      <PageContainer>
        <div className="space-y-4">
          {/* Units */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Units</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Weight Unit</Label>
                <Select 
                  value={settings.weightUnit} 
                  onValueChange={(v) => updateSettings({ weightUnit: v as 'kg' | 'lbs' })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label>Distance Unit</Label>
                <Select 
                  value={settings.distanceUnit} 
                  onValueChange={(v) => updateSettings({ distanceUnit: v as 'km' | 'miles' })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="km">km</SelectItem>
                    <SelectItem value="miles">miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Timer Settings */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Rest Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Default Duration (seconds)</Label>
                <Input
                  type="number"
                  value={settings.defaultRestTimer}
                  onChange={(e) => updateSettings({ defaultRestTimer: parseInt(e.target.value) || 60 })}
                  className="w-20 text-center"
                  min={10}
                  max={600}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Auto-start after completing set</Label>
                <Switch
                  checked={settings.autoStartTimer}
                  onCheckedChange={(checked) => updateSettings({ autoStartTimer: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Vibrate className="h-4 w-4 text-muted-foreground" />
                  <Label>Vibration</Label>
                </div>
                <Switch
                  checked={settings.vibrationEnabled}
                  onCheckedChange={(checked) => updateSettings({ vibrationEnabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Sound</Label>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label>Theme</Label>
                <Select 
                  value={settings.darkMode} 
                  onValueChange={(v) => updateSettings({ darkMode: v as 'system' | 'light' | 'dark' })}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <div className="relative">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Data
                </Button>
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={() => setShowClearConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </CardContent>
          </Card>

          {/* App Info */}
          <Card>
            <CardContent className="p-4 text-center text-sm text-muted-foreground">
              <p>FitTrack Pro v1.0.0</p>
              <p>Built with ❤️ for fitness enthusiasts</p>
            </CardContent>
          </Card>
        </div>
      </PageContainer>

      {/* Clear Data Confirmation */}
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your workouts, exercises, routines, measurements, and settings. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearData}
              className="bg-destructive text-destructive-foreground"
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
