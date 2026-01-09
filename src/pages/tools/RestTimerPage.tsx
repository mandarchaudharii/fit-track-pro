import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { RestTimer } from '@/components/workout/RestTimer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const presets = [30, 60, 90, 120, 180, 300];

export default function RestTimerPage() {
  const [selectedPreset, setSelectedPreset] = useState(90);

  return (
    <>
      <Header title="Rest Timer" showBack />
      <PageContainer>
        <div className="space-y-6">
          <RestTimer 
            key={selectedPreset} 
            defaultSeconds={selectedPreset} 
          />

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-3">Quick Presets</p>
              <div className="grid grid-cols-3 gap-2">
                {presets.map(seconds => {
                  const mins = Math.floor(seconds / 60);
                  const secs = seconds % 60;
                  const label = mins > 0 
                    ? secs > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${mins} min`
                    : `${secs}s`;
                  
                  return (
                    <Button
                      key={seconds}
                      variant={selectedPreset === seconds ? 'default' : 'outline'}
                      onClick={() => setSelectedPreset(seconds)}
                    >
                      {label}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground space-y-2">
              <p><strong>Rest Time Guidelines:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Strength (1-5 reps): 3-5 minutes</li>
                <li>Hypertrophy (6-12 reps): 1-2 minutes</li>
                <li>Endurance (12+ reps): 30-60 seconds</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
