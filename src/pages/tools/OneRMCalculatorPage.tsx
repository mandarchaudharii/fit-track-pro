import { useState } from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';
import { calculateAll1RM, calculateAverage1RM } from '@/utils/calculators';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function OneRMCalculatorPage() {
  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('');

  const weightNum = parseFloat(weight) || 0;
  const repsNum = parseInt(reps) || 0;

  const results = calculateAll1RM(weightNum, repsNum);
  const average = calculateAverage1RM(weightNum, repsNum);

  const formulaDescriptions: Record<string, string> = {
    'Epley': 'Developed by Boyd Epley (1985), widely used for athletes',
    'Brzycki': 'Proposed by Matt Brzycki (1993), optimized for practical rep ranges',
    'Lombardi': 'By Vincent Lombardi (1989), accounts for nonlinear relationships',
    'Lander': 'Created by Jim Lander (1985), designed for athletic testing',
    "O'Conner": 'Similar to Epley but with different constant',
    'Wathen': 'Uses exponential decay model for rep prediction',
  };

  return (
    <>
      <Header title="1RM Calculator" showBack />
      <PageContainer>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Enter Your Lift</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="100"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reps">Reps (1-12)</Label>
                  <Input
                    id="reps"
                    type="number"
                    placeholder="5"
                    min="1"
                    max="12"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="text-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <>
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6 text-center">
                  <p className="text-sm opacity-90 mb-1">Estimated 1RM (Average)</p>
                  <p className="text-4xl font-bold">{average} kg</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Formula Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {results.map(result => (
                    <div 
                      key={result.formula}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{result.formula}</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[200px]">
                            <p>{formulaDescriptions[result.formula]}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <span className="font-mono">{result.value} kg</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-sm text-muted-foreground">
                  <p className="mb-2">
                    <strong>How it works:</strong> This calculator combines multiple established strength 
                    estimation formulas to give you a balanced prediction of your one-rep max.
                  </p>
                  <p>
                    By averaging these formulas, it smooths out the biases of any single method, 
                    giving you a more consistent and reliable estimate.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </PageContainer>
    </>
  );
}
