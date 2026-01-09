import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PageContainer({ children, className, noPadding = false }: PageContainerProps) {
  return (
    <main className={cn(
      "min-h-screen pb-20",
      !noPadding && "px-4 py-4",
      className
    )}>
      {children}
    </main>
  );
}
