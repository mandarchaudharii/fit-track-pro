import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Wifi, WifiOff } from 'lucide-react';
import { useState } from 'react';

export function PWAInstallPrompt() {
  const { isInstallable, isOnline, installApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <Card className="fixed bottom-20 left-4 right-4 z-50 border-primary/20 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Download className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Install FitTrack Pro</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Install for quick access and offline workouts
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={installApp}>
                Install
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>
                Not now
              </Button>
            </div>
          </div>
          <button 
            onClick={() => setDismissed(true)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export function OfflineIndicator() {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-destructive text-destructive-foreground text-center py-1 text-sm z-50 flex items-center justify-center gap-2">
      <WifiOff className="h-4 w-4" />
      <span>You're offline - changes will sync when connected</span>
    </div>
  );
}
