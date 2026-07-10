import { useDataStore, DataColumn } from "@/store/useDataStore";
import { AlertCircle, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo } from "react";
import * as ss from "simple-statistics";

export function Statistics() {
  const { fileInfo, cleanedData, columns } = useDataStore();

  const numericCols = columns.filter(c => c.type === 'numeric');

  const stats = useMemo(() => {
    if (!cleanedData.length || numericCols.length === 0) return [];

    return numericCols.map((col) => {
      const values = cleanedData
        .map(row => Number(row[col.name]))
        .filter(v => !isNaN(v));

      if (values.length === 0) return null;

      try {
        const mean = ss.mean(values);
        const median = ss.median(values);
        
        // simple-statistics mode requires slightly different handling or fallback if multiple modes
        let mode: number | string = 'N/A';
        try {
          mode = ss.mode(values);
        } catch(e) {
          // If all values appear once, mode throws error in some versions, or returns first.
          // We'll just catch it.
        }

        const standardDeviation = values.length > 1 ? ss.standardDeviation(values) : 0;
        const variance = values.length > 1 ? ss.variance(values) : 0;
        const min = ss.min(values);
        const max = ss.max(values);
        const q1 = ss.quantile(values, 0.25);
        const q3 = ss.quantile(values, 0.75);

        // Skewness and kurtosis
        const skewness = values.length > 2 ? ss.sampleSkewness(values) : 0;
        const kurtosis = values.length > 3 ? ss.sampleKurtosis(values) : 0;

        return {
          name: col.name,
          mean: mean.toFixed(4),
          median: median.toFixed(4),
          mode: typeof mode === 'number' ? mode.toFixed(4) : mode,
          stdDev: standardDeviation.toFixed(4),
          variance: variance.toFixed(4),
          min: min.toFixed(4),
          max: max.toFixed(4),
          q1: q1.toFixed(4),
          q3: q3.toFixed(4),
          skewness: skewness.toFixed(4),
          kurtosis: kurtosis.toFixed(4)
        };
      } catch (err) {
        console.error("Stats calculation error for col", col.name, err);
        return null;
      }
    }).filter(Boolean);
  }, [cleanedData, numericCols]);

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

  if (numericCols.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 animate-in fade-in">
        <Calculator className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-2xl font-bold">No Numeric Columns</h2>
        <p className="text-muted-foreground">Statistical analysis requires numeric data.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Statistics Dashboard</h2>
        <p className="text-muted-foreground">
          Comprehensive statistical metrics for all numeric columns.
        </p>
      </div>

      <div className="glass-card rounded-xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-semibold">Descriptive Statistics</h3>
        </div>
        <div className="overflow-x-auto w-full max-w-full">
          <Table className="[&>div]:max-w-full w-full min-w-max">
            <TableHeader>
              <TableRow className="bg-white/5 border-white/10">
                <TableHead className="font-semibold whitespace-nowrap min-w-[150px] sticky left-0 bg-background/95 backdrop-blur-sm z-20">Column</TableHead>
                <TableHead className="whitespace-nowrap">Mean</TableHead>
                <TableHead className="whitespace-nowrap">Median</TableHead>
                <TableHead className="whitespace-nowrap">Mode</TableHead>
                <TableHead className="whitespace-nowrap">Std Dev</TableHead>
                <TableHead className="whitespace-nowrap">Variance</TableHead>
                <TableHead className="whitespace-nowrap">Min</TableHead>
                <TableHead className="whitespace-nowrap">Max</TableHead>
                <TableHead className="whitespace-nowrap">Q1</TableHead>
                <TableHead className="whitespace-nowrap">Q3</TableHead>
                <TableHead className="whitespace-nowrap">Skewness</TableHead>
                <TableHead className="whitespace-nowrap">Kurtosis</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((stat: any, index: number) => (
                <TableRow key={index} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium sticky left-0 bg-background/95 backdrop-blur-sm z-10 border-r border-white/5">
                    {stat.name}
                  </TableCell>
                  <TableCell>{stat.mean}</TableCell>
                  <TableCell>{stat.median}</TableCell>
                  <TableCell>{stat.mode}</TableCell>
                  <TableCell>{stat.stdDev}</TableCell>
                  <TableCell>{stat.variance}</TableCell>
                  <TableCell>{stat.min}</TableCell>
                  <TableCell>{stat.max}</TableCell>
                  <TableCell>{stat.q1}</TableCell>
                  <TableCell>{stat.q3}</TableCell>
                  <TableCell>{stat.skewness}</TableCell>
                  <TableCell>{stat.kurtosis}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <CorrelationMatrix numericCols={numericCols} data={cleanedData} />
    </div>
  );
}

function CorrelationMatrix({ numericCols, data }: { numericCols: DataColumn[], data: any[] }) {
  const matrix = useMemo(() => {
    // Limit to max 10 numeric cols to avoid massive tables
    const colsToUse = numericCols.slice(0, 10);
    const n = colsToUse.length;
    
    if (n < 2) return null;

    const result: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = i; j < n; j++) {
        if (i === j) {
          result[i][j] = 1;
        } else {
          const col1 = colsToUse[i].name;
          const col2 = colsToUse[j].name;
          
          let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;
          let count = 0;

          for (const row of data) {
            const v1 = Number(row[col1]);
            const v2 = Number(row[col2]);
            if (!isNaN(v1) && !isNaN(v2)) {
              sum1 += v1;
              sum2 += v2;
              sum1Sq += v1 * v1;
              sum2Sq += v2 * v2;
              pSum += v1 * v2;
              count++;
            }
          }

          if (count === 0) {
            result[i][j] = 0;
            result[j][i] = 0;
            continue;
          }

          const num = pSum - (sum1 * sum2 / count);
          const den = Math.sqrt((sum1Sq - (sum1 * sum1) / count) * (sum2Sq - (sum2 * sum2) / count));
          
          const corr = den === 0 ? 0 : num / den;
          result[i][j] = corr;
          result[j][i] = corr;
        }
      }
    }

    return { cols: colsToUse, matrix: result };
  }, [numericCols, data]);

  if (!matrix) return null;

  return (
    <div className="glass-card rounded-xl overflow-hidden flex flex-col mt-6">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-xl font-semibold">Correlation Matrix</h3>
        <p className="text-sm text-muted-foreground mt-1">Pearson correlation coefficients (first {matrix.cols.length} numeric columns)</p>
      </div>
      <div className="overflow-x-auto w-full max-w-full">
        <Table className="[&>div]:max-w-full w-full min-w-max">
          <TableHeader>
            <TableRow className="bg-white/5 border-white/10">
              <TableHead className="font-semibold whitespace-nowrap sticky left-0 bg-background/95 backdrop-blur-sm z-20"></TableHead>
              {matrix.cols.map((col, i) => (
                <TableHead key={i} className="whitespace-nowrap font-medium text-center">
                  <div className="truncate max-w-[120px]" title={col.name}>{col.name}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {matrix.matrix.map((row, i) => (
              <TableRow key={i} className="border-white/10 hover:bg-white/5">
                <TableCell className="font-medium sticky left-0 bg-background/95 backdrop-blur-sm z-10 border-r border-white/5 whitespace-nowrap">
                  <div className="truncate max-w-[120px]" title={matrix.cols[i].name}>{matrix.cols[i].name}</div>
                </TableCell>
                {row.map((val, j) => {
                  // Color scale for correlation
                  const isPositive = val > 0;
                  const intensity = Math.abs(val);
                  const bgColor = isPositive 
                    ? `rgba(59, 130, 246, ${intensity * 0.5})` 
                    : `rgba(239, 68, 68, ${intensity * 0.5})`;
                  
                  return (
                    <TableCell 
                      key={j} 
                      className="text-center font-mono text-sm"
                      style={{ backgroundColor: i !== j ? bgColor : 'transparent' }}
                    >
                      {val.toFixed(2)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}