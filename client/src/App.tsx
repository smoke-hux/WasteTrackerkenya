import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./lib/auth";
import SplashScreen from "./components/splash-screen";
import RoleSelection from "./pages/role-selection";
import ResidentDashboard from "./pages/resident/dashboard";
import CollectorDashboard from "./pages/collector/dashboard";
import RequestPickup from "./pages/resident/request-pickup";
import Analytics from "./pages/resident/analytics";
import ReportDumping from "./pages/resident/report-dumping";
import ActiveCollection from "./pages/collector/active-collection";
import MapView from "./pages/map-view";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SplashScreen} />
      <Route path="/role-selection" component={RoleSelection} />
      <Route path="/resident/dashboard" component={ResidentDashboard} />
      <Route path="/collector/dashboard" component={CollectorDashboard} />
      <Route path="/resident/request-pickup" component={RequestPickup} />
      <Route path="/resident/analytics" component={Analytics} />
      <Route path="/resident/report-dumping" component={ReportDumping} />
      <Route path="/collector/active-collection/:id?" component={ActiveCollection} />
      <Route path="/map" component={MapView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <div className="max-w-md mx-auto bg-white min-h-screen relative overflow-hidden">
            <Toaster />
            <Router />
          </div>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
