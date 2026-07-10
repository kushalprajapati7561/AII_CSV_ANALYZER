import { useDataStore } from "@/store/useDataStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight, Binary, Database, Hash, HelpCircle, Layers, Rows } from "lucide-react";

export function Overview() {
  const { fileInfo, cleanedData, columns } = useDataStore();

  if (!fileInfo || cleanedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">No Dataset Loaded</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Please upload a CSV or Excel file on the Home dashboard to view the dataset overview.
        </p>
        <Button asChild className="mt-4">
          <Link to="/">Go to Home Dashboard</Link>
        </Button>
      </div>
    );
  }

  // Calculate metrics
  const totalRows = cleanedData.length;
  const totalColumns = columns.length;
  const totalMissing = columns.reduce((acc, col) => acc + col.missingCount, 0);
  
  // Calculate duplicates using JSON.stringify for simplicity in this frontend demo
  // Note: For large datasets, this might be slow, but requirement states up to 200MB 
  // We'll limit duplicate check to first 10000 rows to prevent UI freeze
  const sampleData = cleanedData.slice(0, 10000);
  const uniqueSet = new Set(sampleData.map(row => JSON.stringify(row)));
  const duplicateCount = Math.max(0, sampleData.length - uniqueSet.size) + (cleanedData.length > 10000 ? ' (in sample)' : '');

  const numericCols = columns.filter(c => c.type === 'numeric').length;
  const catCols = columns.filter(c => c.type === 'categorical').length;
  const dateCols = columns.filter(c => c.type === 'datetime').length;

  const previewData = cleanedData.slice(0, 20); // Show first 20 rows

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Dataset Overview</h2>
        <p className="text-muted-foreground">
          A high-level summary and preview of your dataset.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Rows" value={totalRows.toLocaleString()} icon={Rows} color="text-blue-500" />
        <MetricCard title="Total Columns" value={totalColumns.toLocaleString()} icon={Columns} color="text-indigo-500" />
        <MetricCard title="Missing Values" value={totalMissing.toLocaleString()} icon={HelpCircle} color="text-orange-500" />
        <MetricCard title="Duplicate Records" value={duplicateCount.toString()} icon={Layers} color="text-red-500" />
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          Data Types Summary
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-4">
            <div className="bg-green-500/20 p-3 rounded-lg text-green-500">
              <Hash className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{numericCols}</p>
              <p className="text-sm text-muted-foreground">Numeric Columns</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-4">
            <div className="bg-purple-500/20 p-3 rounded-lg text-purple-500">
              <Binary className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{catCols}</p>
              <p className="text-sm text-muted-foreground">Categorical Columns</p>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-4">
            <div className="bg-cyan-500/20 p-3 rounded-lg text-cyan-500">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dateCols}</p>
              <p className="text-sm text-muted-foreground">Datetime Columns</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Dataset Preview (First {previewData.length} rows)</h3>
          <Button variant="outline" asChild size="sm">
            <Link to="/statistics" className="flex items-center gap-2">
              Go to Statistics <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="overflow-x-auto w-full max-w-full">
          <Table className="[&>div]:max-w-full w-full min-w-max">
            <TableHeader>
              <TableRow className="bg-white/5 hover:bg-white/5 border-white/10">
                {columns.map((col, i) => (
                  <TableHead key={i} className="font-semibold whitespace-nowrap">
                    <div className="flex flex-col">
                      <span>{col.name}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {col.type}
                      </span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="hover:bg-white/5 border-white/10">
                  {columns.map((col, colIndex) => {
                    const value = row[col.name];
                    const isMissing = value === null || value === undefined || value === '';
                    return (
                      <TableCell key={colIndex} className="whitespace-nowrap">
                        {isMissing ? (
                          <span className="text-muted-foreground italic">NaN</span>
                        ) : (
                          String(value)
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
  return (
    <div className="glass-card rounded-xl p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-muted-foreground">{title}</h3>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <p className="text-3xl font-bold truncate">{value}</p>
    </div>
  );
}

// Needed to avoid missing icon error 
function Columns(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M12 3v18" />
    </svg>
  );
}