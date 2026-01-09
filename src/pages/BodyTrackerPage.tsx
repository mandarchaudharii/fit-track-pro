import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, TrendingUp, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function BodyTrackerPage() {
  const { toast } = useToast();
  const { 
    measurements, 
    measurementEntries, 
    getMeasurementHistory,
    addMeasurementEntry,
    deleteMeasurementEntry,
    updateMeasurement,
    addMeasurement,
    deleteMeasurement,
  } = useFitness();

  const [showAddEntry, setShowAddEntry] = useState(false);
  const [showAddMeasurement, setShowAddMeasurement] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedMeasurement, setSelectedMeasurement] = useState<string | null>(null);
  const [entryValue, setEntryValue] = useState('');
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMeasurementName, setNewMeasurementName] = useState('');
  const [newMeasurementUnit, setNewMeasurementUnit] = useState('');

  const enabledMeasurements = measurements.filter(m => m.isEnabled).sort((a, b) => a.order - b.order);

  const handleAddEntry = () => {
    if (!selectedMeasurement || !entryValue) return;
    
    addMeasurementEntry({
      measurementId: selectedMeasurement,
      value: parseFloat(entryValue),
      date: entryDate,
    });
    
    setShowAddEntry(false);
    setEntryValue('');
    toast({ title: 'Measurement logged' });
  };

  const handleAddMeasurement = () => {
    if (!newMeasurementName || !newMeasurementUnit) return;
    
    addMeasurement({
      name: newMeasurementName,
      unit: newMeasurementUnit,
      isEnabled: true,
      isCustom: true,
    });
    
    setShowAddMeasurement(false);
    setNewMeasurementName('');
    setNewMeasurementUnit('');
    toast({ title: 'Measurement type added' });
  };

  const handleDeleteEntry = (id: string) => {
    deleteMeasurementEntry(id);
    setShowDeleteConfirm(null);
    toast({ title: 'Entry deleted' });
  };

  const getLatestValue = (measurementId: string) => {
    const history = getMeasurementHistory(measurementId);
    return history[0]?.value;
  };

  const getChartData = (measurementId: string) => {
    return getMeasurementHistory(measurementId)
      .slice(0, 30)
      .reverse()
      .map(entry => ({
        date: format(new Date(entry.date), 'MM/dd'),
        value: entry.value,
      }));
  };

  return (
    <>
      <Header 
        title="Body Tracker" 
        showBack
        rightContent={
          <Button variant="ghost" size="icon" onClick={() => setShowAddMeasurement(true)}>
            <Settings className="h-5 w-5" />
          </Button>
        }
      />
      <PageContainer>
        <div className="space-y-4">
          {/* Quick Add */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {enabledMeasurements.slice(0, 4).map(m => (
                  <Button 
                    key={m.id}
                    variant="outline"
                    className="h-auto py-3 flex-col"
                    onClick={() => {
                      setSelectedMeasurement(m.id);
                      setShowAddEntry(true);
                    }}
                  >
                    <span className="text-lg font-bold">
                      {getLatestValue(m.id) ?? '—'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {m.name} ({m.unit})
                    </span>
                  </Button>
                ))}
              </div>
              <Button 
                className="w-full mt-3"
                onClick={() => setShowAddEntry(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Log Measurement
              </Button>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              {enabledMeasurements.map(m => {
                const chartData = getChartData(m.id);
                if (chartData.length < 2) return null;
                
                return (
                  <Card key={m.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>{m.name}</span>
                        <span className="text-muted-foreground font-normal">
                          {getLatestValue(m.id)} {m.unit}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={10} />
                            <YAxis fontSize={10} domain={['auto', 'auto']} />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              {enabledMeasurements.every(m => getChartData(m.id).length < 2) && (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Not enough data for charts</p>
                    <p className="text-sm">Log measurements over time to see progress</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-3 mt-4">
              {enabledMeasurements.map(m => {
                const history = getMeasurementHistory(m.id);
                if (history.length === 0) return null;
                
                return (
                  <Card key={m.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{m.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {history.slice(0, 5).map(entry => (
                          <div 
                            key={entry.id}
                            className="flex items-center justify-between py-1 text-sm"
                          >
                            <span className="text-muted-foreground">
                              {format(new Date(entry.date), 'MMM d, yyyy')}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{entry.value} {m.unit}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => setShowDeleteConfirm(entry.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="settings" className="space-y-3 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Measurements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {measurements.sort((a, b) => a.order - b.order).map(m => (
                      <div 
                        key={m.id}
                        className="flex items-center justify-between py-1"
                      >
                        <div>
                          <p className="font-medium">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.unit}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={m.isEnabled}
                            onCheckedChange={(checked) => updateMeasurement(m.id, { isEnabled: checked })}
                          />
                          {m.isCustom && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => deleteMeasurement(m.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setShowAddMeasurement(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Measurement
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>

      {/* Add Entry Dialog */}
      <Dialog open={showAddEntry} onOpenChange={setShowAddEntry}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Measurement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Measurement Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {enabledMeasurements.map(m => (
                  <Button
                    key={m.id}
                    variant={selectedMeasurement === m.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMeasurement(m.id)}
                  >
                    {m.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Value ({enabledMeasurements.find(m => m.id === selectedMeasurement)?.unit})</Label>
              <Input
                type="number"
                step="0.1"
                value={entryValue}
                onChange={(e) => setEntryValue(e.target.value)}
                placeholder="Enter value"
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddEntry(false)}>Cancel</Button>
            <Button onClick={handleAddEntry} disabled={!selectedMeasurement || !entryValue}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Measurement Type Dialog */}
      <Dialog open={showAddMeasurement} onOpenChange={setShowAddMeasurement}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Measurement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={newMeasurementName}
                onChange={(e) => setNewMeasurementName(e.target.value)}
                placeholder="e.g., Shoulders"
              />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Input
                value={newMeasurementUnit}
                onChange={(e) => setNewMeasurementUnit(e.target.value)}
                placeholder="e.g., cm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMeasurement(false)}>Cancel</Button>
            <Button onClick={handleAddMeasurement} disabled={!newMeasurementName || !newMeasurementUnit}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this measurement entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => showDeleteConfirm && handleDeleteEntry(showDeleteConfirm)}
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
