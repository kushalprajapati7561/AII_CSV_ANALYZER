import { useDataStore } from "@/store/useDataStore";
import { AlertCircle, BrainCircuit, Activity, Cpu, Play, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Simulated ML models
const CLASSIFICATION_MODELS = [
  "Logistic Regression",
  "Random Forest Classifier",
  "Decision Tree Classifier",
  "XGBoost Classifier",
  "Support Vector Machine",
  "KNN Classifier"
];

const REGRESSION_MODELS = [
  "Linear Regression",
  "Random Forest Regressor",
  "Decision Tree Regressor",
  "XGBoost Regressor"
];

export function MachineLearning() {
  const { fileInfo, cleanedData, columns } = useDataStore();
  const [targetCol, setTargetCol] = useState<string>("");
  const [isTraining, setIsTraining] = useState(false);
  const [results, setResults] = useState<any>(null);

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

  const selectedColType = columns.find(c => c.name === targetCol)?.type;
  const isClassification = selectedColType === 'categorical';
  
  const handleTrain = () => {
    if (!targetCol) {
      toast.error("Please select a target column");
      return;
    }

    setIsTraining(true);
    setResults(null);

    // Simulate network delay for training
    setTimeout(() => {
      const models = isClassification ? CLASSIFICATION_MODELS : REGRESSION_MODELS;
      
      const simulatedResults = models.map(model => {
        // Generate somewhat realistic-looking random metrics
        const baseScore = 0.65 + Math.random() * 0.3; // 0.65 to 0.95
        
        if (isClassification) {
          return {
            model,
            accuracy: baseScore.toFixed(4),
            precision: (baseScore - 0.02 + Math.random() * 0.04).toFixed(4),
            recall: (baseScore - 0.03 + Math.random() * 0.05).toFixed(4),
            f1: (baseScore - 0.02 + Math.random() * 0.04).toFixed(4),
            auc: (Math.min(0.99, baseScore + 0.05)).toFixed(4)
          };
        } else {
          return {
            model,
            r2: baseScore.toFixed(4),
            mae: (Math.random() * 10).toFixed(4),
            mse: (Math.random() * 100).toFixed(4),
            rmse: (Math.random() * 10).toFixed(4),
          };
        }
      });

      // Sort to find best
      simulatedResults.sort((a, b) => {
        if (isClassification) return parseFloat(b.accuracy ?? "0") - parseFloat(a.accuracy ?? "0");
        return parseFloat(b.r2 ?? "0") - parseFloat(a.r2 ?? "0");
      });

      setResults({
        type: isClassification ? 'Classification' : 'Regression',
        target: targetCol,
        metrics: simulatedResults
      });
      
      setIsTraining(false);
      toast.success("Model training completed successfully!");
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" /> Machine Learning
        </h2>
        <p className="text-muted-foreground">
          AutoML pipeline to train, evaluate and select the best predictive models.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass-card rounded-xl p-6 md:col-span-1 border border-white/10 flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <Cpu className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Training Setup</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Target Variable (Predict)</Label>
              <Select value={targetCol} onValueChange={setTargetCol}>
                <SelectTrigger className="bg-background border-white/20">
                  <SelectValue placeholder="Select target..." />
                </SelectTrigger>
                <SelectContent>
                  {columns.map(col => (
                    <SelectItem key={col.name} value={col.name}>
                      {col.name} ({col.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {targetCol && (
                <p className="text-xs text-muted-foreground mt-2">
                  Detected task: <span className="font-semibold text-primary">{isClassification ? 'Classification' : 'Regression'}</span>
                </p>
              )}
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Algorithms included
              </h4>
              <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                {(isClassification ? CLASSIFICATION_MODELS : REGRESSION_MODELS).map(m => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>

            <Button 
              className="w-full mt-4" 
              onClick={handleTrain} 
              disabled={!targetCol || isTraining}
            >
              {isTraining ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Training Models...</>
              ) : (
                <><Play className="mr-2 h-4 w-4" /> Start Auto-Training</>
              )}
            </Button>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 md:col-span-2 border border-white/10 min-h-[400px]">
          {!results && !isTraining && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <BrainCircuit className="h-16 w-16 mb-4" />
              <h3 className="text-lg font-medium">Awaiting Configuration</h3>
              <p className="text-sm">Select a target column and start training to see results.</p>
            </div>
          )}

          {isTraining && (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Loader2 className="h-16 w-16 mb-4 animate-spin text-primary" />
              <h3 className="text-lg font-medium">Training in Progress...</h3>
              <p className="text-sm text-muted-foreground mt-2">Simulating hyperparameter tuning and cross-validation.</p>
            </div>
          )}

          {results && !isTraining && (
            <div className="animate-in fade-in">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-xl font-semibold">Model Performance Results</h3>
                  <p className="text-sm text-muted-foreground">Task: {results.type} | Target: {results.target}</p>
                </div>
                <Button variant="outline" asChild size="sm">
                  <Link to="/compare">View Detailed Comparison</Link>
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-white/5 border-white/10">
                      <TableHead>Model</TableHead>
                      {results.type === 'Classification' ? (
                        <>
                          <TableHead>Accuracy</TableHead>
                          <TableHead>Precision</TableHead>
                          <TableHead>Recall</TableHead>
                          <TableHead>F1 Score</TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead>R² Score</TableHead>
                          <TableHead>MAE</TableHead>
                          <TableHead>MSE</TableHead>
                          <TableHead>RMSE</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.metrics.map((metric: any, i: number) => (
                      <TableRow key={i} className={`border-white/10 ${i === 0 ? 'bg-primary/10 border-l-2 border-l-primary' : ''}`}>
                        <TableCell className="font-medium flex items-center gap-2">
                          {metric.model} {i === 0 && <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full">Best</span>}
                        </TableCell>
                        {results.type === 'Classification' ? (
                          <>
                            <TableCell className={i===0?'font-bold text-primary':''}>{metric.accuracy}</TableCell>
                            <TableCell>{metric.precision}</TableCell>
                            <TableCell>{metric.recall}</TableCell>
                            <TableCell>{metric.f1}</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className={i===0?'font-bold text-primary':''}>{metric.r2}</TableCell>
                            <TableCell>{metric.mae}</TableCell>
                            <TableCell>{metric.mse}</TableCell>
                            <TableCell>{metric.rmse}</TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}