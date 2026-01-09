import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { getRepPercentages, calculatePercentageWeight } from '@/utils/calculators';

export default function PercentageChartPage() {
  const [oneRM, setOneRM] = useState<string>('');

  const oneRMNum = parseFloat(oneRM) || 0;
  const percentages = getRepPercentages();

  return (
    <>
      <Header title="Percentage Chart" showBack />
      <PageContainer>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Enter Your 1RM</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="oneRM">One Rep Max (kg)</Label>
                <Input
                  id="oneRM"
                  type="number"
                  placeholder="100"
                  value={oneRM}
                  onChange={(e) => setOneRM(e.target.value)}
                  className="text-lg"
                />
              </div>
            </CardContent>
          </Card>

          {oneRMNum > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Weight by Reps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground pb-2 border-b">
                    <span>Reps</span>
                    <span className="text-center">%</span>
                    <span className="text-right">Weight</span>
                  </div>
                  {percentages.map(({ reps, percentage }) => (
                    <div 
                      key={reps}
                      className="grid grid-cols-3 py-2 border-b last:border-0"
                    >
                      <span className="font-medium">{reps} rep{reps > 1 ? 's' : ''}</span>
                      <span className="text-center text-muted-foreground">{percentage}%</span>
                      <span className="text-right font-mono">
                        {calculatePercentageWeight(oneRMNum, percentage)} kg
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              <p>
                These percentages are general guidelines based on Prilepin's Chart and 
                common strength training protocols. Individual results may vary based on 
                training experience and exercise type.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </>
  );
}
