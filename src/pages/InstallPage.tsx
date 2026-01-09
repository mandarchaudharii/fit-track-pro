import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { Header } from '@/components/layout/Header';
import { Download, Smartphone, Zap, WifiOff, Check, Share, PlusSquare } from 'lucide-react';

export default function InstallPage() {
  const { isInstallable, isInstalled, installApp } = usePWA();

  const features = [
    { icon: Zap, title: 'Quick Access', description: 'Launch directly from your home screen' },
    { icon: WifiOff, title: 'Works Offline', description: 'Track workouts even without internet' },
    { icon: Smartphone, title: 'Native Feel', description: 'Full-screen app experience' },
  ];

  if (isInstalled) {
    return (
      <>
        <Header title="Install App" showBack />
        <PageContainer>
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <Check className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Already Installed!</h2>
            <p className="text-muted-foreground max-w-sm">
              FitTrack Pro is installed on your device. Enjoy tracking your workouts!
            </p>
          </div>
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <Header title="Install App" showBack />
      <PageContainer>
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="text-center py-8">
            <div className="rounded-full bg-primary/10 p-6 mx-auto w-fit mb-4">
              <Download className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Install FitTrack Pro</h1>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Add to your home screen for the best experience
            </p>
          </div>

          {/* Features */}
          <div className="grid gap-4">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Install Button */}
          {isInstallable ? (
            <Button onClick={installApp} size="lg" className="w-full">
              <Download className="mr-2 h-5 w-5" />
              Install Now
            </Button>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Manual Installation</CardTitle>
                <CardDescription>
                  If the install button doesn't appear, follow these steps:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <Smartphone className="h-4 w-4" /> iOS (Safari)
                  </h4>
                  <ol className="text-sm text-muted-foreground space-y-2 ml-6 list-decimal">
                    <li className="flex items-center gap-2">
                      Tap the Share button <Share className="h-4 w-4 inline" />
                    </li>
                    <li className="flex items-center gap-2">
                      Scroll and tap "Add to Home Screen" <PlusSquare className="h-4 w-4 inline" />
                    </li>
                    <li>Tap "Add" to confirm</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <Smartphone className="h-4 w-4" /> Android (Chrome)
                  </h4>
                  <ol className="text-sm text-muted-foreground space-y-2 ml-6 list-decimal">
                    <li>Tap the menu button (⋮)</li>
                    <li>Tap "Install app" or "Add to Home screen"</li>
                    <li>Confirm the installation</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </PageContainer>
    </>
  );
}
