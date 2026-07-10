import { useDataStore } from "@/store/useDataStore";
import { AlertCircle, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function FeatureImportance() {
  const { fileInfo, cleanedData } = useDataStore();

  if (!fileInfo || cleanedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">No Dataset Loaded</h2>
        <Button asChild className="mt-4">
          <Link to="/">Go to Home Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" /> Feature Importance
        </h2>
        <p className="text-muted-foreground">
          Discover which variables have the most impact on predictions.
        </p>
      </div>

      <div className="glass-card rounded-xl p-12 text-center border-dashed border-white/20">
        <p className="text-muted-foreground mb-4">
          Feature importance scores require a trained model (like Random Forest or XGBoost).
        </p>
        <Button asChild variant="outline">
          <Link to="/ml">Go to ML Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}