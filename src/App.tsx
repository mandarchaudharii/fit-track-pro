import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FitnessProvider } from "@/contexts/FitnessContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { PWAInstallPrompt, OfflineIndicator } from "@/components/PWAInstallPrompt";
import { AppThemeSync } from "@/components/theme/AppThemeSync";

// Pages
import HomePage from "./pages/HomePage";
import WorkoutPage from "./pages/WorkoutPage";
import WorkoutDetailPage from "./pages/WorkoutDetailPage";
import HistoryPage from "./pages/HistoryPage";
import ToolsPage from "./pages/ToolsPage";
import ProfilePage from "./pages/ProfilePage";
import ExercisesPage from "./pages/ExercisesPage";
import ExerciseDetailPage from "./pages/ExerciseDetailPage";
import RoutinesPage from "./pages/RoutinesPage";
import BodyTrackerPage from "./pages/BodyTrackerPage";
import GoalsPage from "./pages/GoalsPage";
import CategoriesPage from "./pages/CategoriesPage";
import StatisticsPage from "./pages/StatisticsPage";
import SettingsPage from "./pages/SettingsPage";
import PersonalRecordsPage from "./pages/PersonalRecordsPage";
import OneRMCalculatorPage from "./pages/tools/OneRMCalculatorPage";
import ProgressionPlannerPage from "./pages/tools/ProgressionPlannerPage";
import PlateCalculatorPage from "./pages/tools/PlateCalculatorPage";
import PercentageChartPage from "./pages/tools/PercentageChartPage";
import RestTimerPage from "./pages/tools/RestTimerPage";
import InstallPage from "./pages/InstallPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FitnessProvider>
        <AppThemeSync />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <OfflineIndicator />
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/workout" element={<WorkoutPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/history/:id" element={<WorkoutDetailPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/tools/calculator" element={<OneRMCalculatorPage />} />
              <Route path="/tools/progression" element={<ProgressionPlannerPage />} />
              <Route path="/tools/plates" element={<PlateCalculatorPage />} />
              <Route path="/tools/percentage" element={<PercentageChartPage />} />
              <Route path="/tools/timer" element={<RestTimerPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/exercises" element={<ExercisesPage />} />
              <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
              <Route path="/routines" element={<RoutinesPage />} />
              <Route path="/body-tracker" element={<BodyTrackerPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/personal-records" element={<PersonalRecordsPage />} />
              <Route path="/install" element={<InstallPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
            <PWAInstallPrompt />
          </div>
        </BrowserRouter>
      </FitnessProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
