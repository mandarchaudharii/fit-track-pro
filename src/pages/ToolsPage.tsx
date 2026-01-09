import { Calculator, Target, Disc, BarChart3, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { PageContainer } from '@/components/layout/PageContainer';

const tools = [
  {
    id: 'calculator',
    name: '1RM Calculator',
    description: 'Calculate your one-rep max using multiple formulas',
    icon: Calculator,
    path: '/tools/calculator',
  },
  {
    id: 'progression',
    name: 'Progression Planner',
    description: 'Plan your strength progression over weeks',
    icon: Target,
    path: '/tools/progression',
  },
  {
    id: 'plates',
    name: 'Plate Calculator',
    description: 'Calculate plates needed for any weight',
    icon: Disc,
    path: '/tools/plates',
  },
  {
    id: 'percentage',
    name: 'Percentage Chart',
    description: 'View weights at different percentages of 1RM',
    icon: BarChart3,
    path: '/tools/percentage',
  },
  {
    id: 'timer',
    name: 'Rest Timer',
    description: 'Customizable rest timer between sets',
    icon: Timer,
    path: '/tools/timer',
  },
];

export default function ToolsPage() {
  const navigate = useNavigate();

  return (
    <>
      <Header title="Tools" />
      <PageContainer>
        <div className="space-y-3">
          {tools.map(tool => (
            <Card 
              key={tool.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate(tool.path)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <tool.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{tool.name}</p>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </PageContainer>
    </>
  );
}
