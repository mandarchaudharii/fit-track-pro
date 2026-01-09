import React, { createContext, useContext, ReactNode } from 'react';
import { useFitnessData } from '@/hooks/useFitnessData';

type FitnessContextType = ReturnType<typeof useFitnessData>;

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export function FitnessProvider({ children }: { children: ReactNode }) {
  const fitnessData = useFitnessData();

  return (
    <FitnessContext.Provider value={fitnessData}>
      {children}
    </FitnessContext.Provider>
  );
}

export function useFitness() {
  const context = useContext(FitnessContext);
  if (context === undefined) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
}
