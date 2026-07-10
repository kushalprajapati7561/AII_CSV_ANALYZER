import { useDataStore } from "@/store/useDataStore";
import { AlertCircle, BrainCircuit, Lightbulb, TrendingUp, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Insights() {
  const { fileInfo, cleanedData, columns } = useDataStore();

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

  // Generate simulated insights based on basic heuristics
  const generateInsights = () => {
    const insights = [];
    
    // Size insight
    if (cleanedData.length > 1000) {
      insights.push({
        type: 'positive',
        title: 'Large Dataset',
        description: `This dataset contains ${cleanedData.length} records, which provides a solid foundation for robust machine learning models.`,
        icon: TrendingUp,
        color: 'text-green-500',
        bg: 'bg-green-500/10'
      });
    } else {
      insights.push({
        type: 'warning',
        title: 'Small Dataset',
        description: `This dataset only has ${cleanedData.length} records. Machine learning models might suffer from overfitting or lack generalizability.`,
        icon: AlertTriangle,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10'
      });
    }

    // Missing values
    const totalMissing = columns.reduce((a,c)=>a+c.missingCount, 0);
    if (totalMissing > 0) {
      insights.push({
        type: 'warning',
        title: 'Missing Data Detected',
        description: `Found ${totalMissing} missing values across ${columns.filter(c=>c.missingCount>0).length} columns. Consider visiting the Data Cleaning module before model training.`,
        icon: AlertCircle,
        color: 'text-red-500',
        bg: 'bg-red-500/10'
      });
    } else {
      insights.push({
        type: 'positive',
        title: 'Clean Data',
        description: `No missing values detected in the current dataset. Data is in excellent shape for analysis.`,
        icon: BrainCircuit,
        color: 'text-blue-500',
        bg: 'bg-blue-500/10'
      });
    }

    // Types insight
    const numericCols = columns.filter(c=>c.type === 'numeric').length;
    if (numericCols > columns.length / 2) {
      insights.push({
        type: 'info',
        title: 'Numeric Dominated',
        description: `Majority of your columns (${numericCols}/${columns.length}) are numeric. This dataset is well-suited for regression analysis or statistical modeling.`,
        icon: Lightbulb,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10'
      });
    } else {
      insights.push({
        type: 'info',
        title: 'Categorical Rich',
        description: `A significant portion of your data is categorical. Ensure proper encoding (e.g., One-Hot Encoding) is applied if passing to algorithms that require numeric inputs.`,
        icon: Lightbulb,
        color: 'text-cyan-500',
        bg: 'bg-cyan-500/10'
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Lightbulb className="h-8 w-8 text-yellow-500" /> AI Insights Engine
        </h2>
        <p className="text-muted-foreground">
          Automated insights and recommendations based on heuristic analysis of your dataset.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight, idx) => {
          const Icon = insight.icon;
          return (
            <div key={idx} className={`glass-card rounded-xl p-6 border-l-4 ${insight.color.replace('text', 'border')}`}>
              <div className="flex items-start gap-4 mb-4">
                <div className={`${insight.bg} p-3 rounded-lg ${insight.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mt-1">{insight.title}</h3>
              </div>
              <p className="text-muted-foreground">{insight.description}</p>
            </div>
          );
        })}
      </div>

      <div className="glass-card rounded-xl p-8 mt-4 text-center border-dashed border-white/20">
        <BrainCircuit className="h-12 w-12 text-primary mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-medium mb-2">Ready for Machine Learning?</h3>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Based on the insights gathered, your dataset has been profiled. Proceed to the Machine Learning Dashboard to train and evaluate models.
        </p>
        <Button asChild size="lg">
          <Link to="/ml">Go to ML Dashboard <TrendingUp className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </div>
  );
}