import { useDataStore } from "@/store/useDataStore";
import { AlertCircle, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, ScatterChart, Scatter, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#ec4899'];

export function Visualization() {
  const { fileInfo, cleanedData, columns } = useDataStore();
  const [chartType, setChartType] = useState<string>("bar");
  const [xAxisCol, setXAxisCol] = useState<string>("");
  const [yAxisCol, setYAxisCol] = useState<string>("");

  const numericCols = columns.filter(c => c.type === 'numeric');
  const catCols = columns.filter(c => c.type === 'categorical' || c.type === 'datetime');

  // Set defaults if not set
  if (!xAxisCol && columns.length > 0) {
    setXAxisCol(catCols.length > 0 ? catCols[0].name : columns[0].name);
  }
  if (!yAxisCol && numericCols.length > 0) {
    setYAxisCol(numericCols[0].name);
  }

  const chartData = useMemo(() => {
    if (!xAxisCol || cleanedData.length === 0) return [];
    
    // For scatter, we need raw points. For others, we might want to aggregate if X is categorical
    if (chartType === "scatter") {
      return cleanedData.slice(0, 1000).map(row => ({
        x: Number(row[xAxisCol]),
        y: Number(row[yAxisCol]),
      })).filter(d => !isNaN(d.x) && !isNaN(d.y));
    }

    // Aggregation for Bar/Line/Area/Pie
    const isYColNumeric = columns.find(c => c.name === yAxisCol)?.type === 'numeric';
    
    if (isYColNumeric) {
      // Group by X and sum/avg Y (we'll just sum for simplicity or take first if many)
      // To keep it simple and performant, we'll take top 20 categories
      const grouped = new Map<string, number>();
      const counts = new Map<string, number>();
      
      cleanedData.forEach(row => {
        const xVal = String(row[xAxisCol]);
        const yVal = Number(row[yAxisCol]);
        if (!isNaN(yVal) && xVal !== 'null' && xVal !== 'undefined') {
          grouped.set(xVal, (grouped.get(xVal) || 0) + yVal);
          counts.set(xVal, (counts.get(xVal) || 0) + 1);
        }
      });

      return Array.from(grouped.entries())
        .map(([key, sum]) => ({
          name: key,
          value: sum / (counts.get(key) || 1) // Mean value per category
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 20); // Top 20 for readability
    }

    return [];
  }, [cleanedData, xAxisCol, yAxisCol, chartType, columns]);

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

  const renderChart = () => {
    if (chartData.length === 0) return <div className="flex h-full items-center justify-center text-muted-foreground">Insufficient or invalid data for this combination</div>;

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Bar dataKey="value" name={`Mean ${yAxisCol}`} fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Line type="monotone" dataKey="value" name={`Mean ${yAxisCol}`} stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Area type="monotone" dataKey="value" name={`Mean ${yAxisCol}`} stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Legend />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      case "scatter":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis type="number" dataKey="x" name={xAxisCol} stroke="rgba(255,255,255,0.5)" />
              <YAxis type="number" dataKey="y" name={yAxisCol} stroke="rgba(255,255,255,0.5)" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Scatter name="Data Points" data={chartData} fill="var(--chart-4)" opacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Visualization Dashboard</h2>
        <p className="text-muted-foreground">
          Interactive charts and graphs generated from your dataset.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4 xl:grid-cols-5 flex-1 min-h-0">
        {/* Controls Sidebar */}
        <div className="glass-card rounded-xl p-6 flex flex-col gap-6 md:col-span-1 border border-white/10">
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Chart Settings</h3>
          </div>

          <div className="space-y-4 flex-1">
            <div className="space-y-2">
              <Label>Chart Type</Label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="scatter">Scatter Plot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>X-Axis (Category/Independent)</Label>
              <Select value={xAxisCol} onValueChange={setXAxisCol}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select X axis..." />
                </SelectTrigger>
                <SelectContent>
                  {columns.map(col => (
                    <SelectItem key={col.name} value={col.name}>
                      {col.name} ({col.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Y-Axis (Numeric/Dependent)</Label>
              <Select value={yAxisCol} onValueChange={setYAxisCol}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select Y axis..." />
                </SelectTrigger>
                <SelectContent>
                  {numericCols.map(col => (
                    <SelectItem key={col.name} value={col.name}>
                      {col.name}
                    </SelectItem>
                  ))}
                  {numericCols.length === 0 && (
                    <SelectItem value="none" disabled>No numeric columns available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="glass-card rounded-xl p-6 md:col-span-3 xl:col-span-4 min-h-[500px] flex flex-col border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold capitalize">{chartType} Chart</h3>
            <div className="text-sm text-muted-foreground flex gap-2 items-center">
               <PieChartIcon className="h-4 w-4" />
               Showing top {chartData.length} entries
            </div>
          </div>
          <div className="flex-1 w-full min-h-0">
            {renderChart()}
          </div>
        </div>
      </div>
    </div>
  );
}