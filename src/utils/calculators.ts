// 1RM Calculator formulas

export interface OneRepMaxResult {
  formula: string;
  value: number;
}

export function calculateEpley(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

export function calculateBrzycki(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * (36 / (37 - reps));
}

export function calculateLombardi(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * Math.pow(reps, 0.1);
}

export function calculateLander(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return (100 * weight) / (101.3 - 2.67123 * reps);
}

export function calculateOConner(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return weight * (1 + reps / 40);
}

export function calculateWathen(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return (100 * weight) / (48.8 + 53.8 * Math.exp(-0.075 * reps));
}

export function calculateAll1RM(weight: number, reps: number): OneRepMaxResult[] {
  if (reps < 1 || reps > 12 || weight <= 0) return [];
  
  return [
    { formula: 'Epley', value: Math.round(calculateEpley(weight, reps) * 10) / 10 },
    { formula: 'Brzycki', value: Math.round(calculateBrzycki(weight, reps) * 10) / 10 },
    { formula: 'Lombardi', value: Math.round(calculateLombardi(weight, reps) * 10) / 10 },
    { formula: 'Lander', value: Math.round(calculateLander(weight, reps) * 10) / 10 },
    { formula: "O'Conner", value: Math.round(calculateOConner(weight, reps) * 10) / 10 },
    { formula: 'Wathen', value: Math.round(calculateWathen(weight, reps) * 10) / 10 },
  ];
}

export function calculateAverage1RM(weight: number, reps: number): number {
  const results = calculateAll1RM(weight, reps);
  if (results.length === 0) return 0;
  const sum = results.reduce((acc, r) => acc + r.value, 0);
  return Math.round((sum / results.length) * 10) / 10;
}

// Plate Calculator
export interface PlateResult {
  plate: number;
  count: number;
}

export function calculatePlates(totalWeight: number, barWeight: number = 20): PlateResult[] {
  const plates = [25, 20, 15, 10, 5, 2.5, 1.25];
  const weightPerSide = (totalWeight - barWeight) / 2;
  
  if (weightPerSide <= 0) return [];
  
  const result: PlateResult[] = [];
  let remaining = weightPerSide;
  
  for (const plate of plates) {
    const count = Math.floor(remaining / plate);
    if (count > 0) {
      result.push({ plate, count });
      remaining -= plate * count;
    }
  }
  
  return result;
}

// Rep percentage calculator
export function calculatePercentageWeight(oneRepMax: number, percentage: number): number {
  return Math.round((oneRepMax * (percentage / 100)) * 2) / 2;
}

export function getRepPercentages(): { reps: number; percentage: number }[] {
  return [
    { reps: 1, percentage: 100 },
    { reps: 2, percentage: 95 },
    { reps: 3, percentage: 93 },
    { reps: 4, percentage: 90 },
    { reps: 5, percentage: 87 },
    { reps: 6, percentage: 85 },
    { reps: 7, percentage: 83 },
    { reps: 8, percentage: 80 },
    { reps: 9, percentage: 77 },
    { reps: 10, percentage: 75 },
    { reps: 11, percentage: 73 },
    { reps: 12, percentage: 70 },
  ];
}
