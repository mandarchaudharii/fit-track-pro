import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { calculatePlates } from '@/utils/calculators';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const plateColors: Record<number, string> = {
  25: 'hsl(0, 70%, 50%)',     // Red
  20: 'hsl(210, 70%, 50%)',   // Blue
  15: 'hsl(45, 70%, 50%)',    // Yellow
  10: 'hsl(120, 70%, 50%)',   // Green
  5: 'hsl(0, 0%, 50%)',       // Gray
  2.5: 'hsl(0, 0%, 30%)',     // Dark gray
  1.25: 'hsl(0, 0%, 70%)',    // Light gray
};

export default function PlateCalculatorPage() {
  const [totalWeight, setTotalWeight] = useState<string>('');
  const [barWeight, setBarWeight] = useState<string>('20');

  const weightNum = parseFloat(totalWeight) || 0;
  const barNum = parseFloat(barWeight) || 20;

  const plates = calculatePlates(weightNum, barNum);
  const perSideWeight = (weightNum - barNum) / 2;

  return (
    <>
      <Header title="Plate Calculator" showBack />
      <PageContainer>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Enter Weight</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totalWeight">Total Weight (kg)</Label>
                <Input
                  id="totalWeight"
                  type="number"
                  placeholder="100"
                  value={totalWeight}
                  onChange={(e) => setTotalWeight(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="barWeight">Bar Weight</Label>
                <Select value={barWeight} onValueChange={setBarWeight}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">Olympic Bar (20kg)</SelectItem>
                    <SelectItem value="15">Women's Bar (15kg)</SelectItem>
                    <SelectItem value="10">EZ Bar (10kg)</SelectItem>
                    <SelectItem value="0">No Bar (0kg)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {plates.length > 0 && (
            <>
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Per Side</p>
                  <p className="text-3xl font-bold">{perSideWeight} kg</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Plates Needed (each side)</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Visual representation */}
                  <div className="flex items-center justify-center gap-1 mb-6 py-4">
                    {/* Bar end */}
                    <div className="w-4 h-16 bg-muted-foreground rounded-l-full" />
                    
                    {/* Plates */}
                    {plates.flatMap(({ plate, count }) =>
                      Array(count).fill(null).map((_, i) => (
                        <div
                          key={`${plate}-${i}`}
                          className="rounded"
                          style={{
                            backgroundColor: plateColors[plate],
                            width: plate >= 15 ? '12px' : '8px',
                            height: plate >= 20 ? '80px' : plate >= 10 ? '64px' : plate >= 5 ? '48px' : '36px',
                          }}
                        />
                      ))
                    )}
                    
                    {/* Collar */}
                    <div className="w-3 h-10 bg-muted-foreground rounded" />
                  </div>

                  {/* List */}
                  <div className="space-y-2">
                    {plates.map(({ plate, count }) => (
                      <div 
                        key={plate}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: plateColors[plate] }}
                          />
                          <span className="font-medium">{plate} kg</span>
                        </div>
                        <span className="font-mono">× {count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {weightNum > 0 && plates.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <p>Weight is less than or equal to bar weight</p>
              </CardContent>
            </Card>
          )}
        </div>
      </PageContainer>
    </>
  );
}
