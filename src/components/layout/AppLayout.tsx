import { Home, LayoutDashboard, Calculator, Eraser, LineChart, Lightbulb, BrainCircuit, Columns, Target, FileOutput, Menu, X } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { name: "Home Dashboard", path: "/", icon: Home },
  { name: "Dataset Overview", path: "/overview", icon: LayoutDashboard },
  { name: "Statistics", path: "/statistics", icon: Calculator },
  { name: "Data Cleaning", path: "/cleaning", icon: Eraser },
  { name: "Visualization", path: "/visualization", icon: LineChart },
  { name: "AI Insights", path: "/insights", icon: Lightbulb },
  { name: "Machine Learning", path: "/ml", icon: BrainCircuit },
  { name: "Model Compare", path: "/compare", icon: Columns },
  { name: "Feature Importance", path: "/feature-importance", icon: Target },
  { name: "Report Generation", path: "/report", icon: FileOutput },
];

export function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-background/90" />

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 glass-panel ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} flex`}>
        <div className="flex h-16 shrink-0 items-center justify-between px-6">
          <h1 className="text-xl font-bold text-primary truncate">AI CSV Analyzer</h1>
          <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-primary/20 text-primary border border-primary/20" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 flex-col min-w-0">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-white/10 bg-background/50 backdrop-blur-md px-6 lg:hidden">
          <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <span className="font-semibold text-foreground truncate">
            {NAV_ITEMS.find((item) => item.path === location.pathname)?.name || "Dashboard"}
          </span>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}