import { useDataStore } from "@/store/useDataStore";
import { AlertCircle, Columns, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function ModelCompare() {
  const { fileInfo, cleanedData, mlResults } = useDataStore();

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

  if (!mlResults) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in duration-500">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Columns className="h-8 w-8 text-primary" /> Model Comparison
          </h2>
          <p className="text-muted-foreground">
            Detailed breakdown of model metrics.
          </p>
        </div>

        <div className="glass-card rounded-xl p-12 text-center border-dashed border-white/20">
          <p className="text-muted-foreground mb-4">
            To see model comparison leaderboards, you must first train models in the ML Dashboard.
          </p>
          <Button asChild variant="outline">
            <Link to="/ml">Go to ML Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const metricKey = mlResults.type === 'Classification' ? 'accuracy' : 'r2';
  const metricLabel = mlResults.type === 'Classification' ? 'Accuracy' : 'R² Score';

  // Format data for chart
  const chartData = mlResults.metrics.map(m => ({
    name: m.model.replace(/Classifier|Regressor|Regression/, '').trim() || m.model,
    value: parseFloat(m[metricKey] || "0"),
    originalName: m.model
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Columns className="h-8 w-8 text-primary" /> Model Comparison
        </h2>
        <p className="text-muted-foreground">
          Detailed breakdown of model metrics for {mlResults.target} ({mlResults.type}).
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-card rounded-xl p-6 border border-white/10 flex flex-col min-h-[400px]">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" /> Leaderboard
          </h3>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-white/5 border-white/10">
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead className="text-right">{metricLabel}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mlResults.metrics.map((metric: any, i: number) => (
                  <TableRow key={i} className={`border-white/10 ${i === 0 ? 'bg-primary/10 border-l-2 border-l-primary' : ''}`}>
                    <TableCell className="font-medium text-muted-foreground">
                      #{i + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {metric.model}
                      {i === 0 && <span className="ml-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full inline-block">Best Model</span>}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {metric[metricKey]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-white/10 flex flex-col min-h-[400px]">
          <h3 className="text-xl font-semibold mb-6">Performance Chart</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 1]} stroke="rgba(255,255,255,0.5)" />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" width={90} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}
                  formatter={(value: number) => [value.toFixed(4), metricLabel]}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]}
                  barSize={24}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "var(--chart-1)" : "var(--chart-2)"} opacity={index === 0 ? 1 : 0.6} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}