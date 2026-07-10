import { useDataStore } from "@/store/useDataStore";
import { AlertCircle, Eraser, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function Cleaning() {
  const { fileInfo, cleanedData, columns, setCleanedData, rawData } = useDataStore();
  const [selectedCol, setSelectedCol] = useState<string>("all");

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

  const handleRemoveDuplicates = () => {
    // Basic deduplication via stringify
    const uniqueMap = new Map();
    cleanedData.forEach(row => {
      uniqueMap.set(JSON.stringify(row), row);
    });
    const newData = Array.from(uniqueMap.values());
    const removed = cleanedData.length - newData.length;
    setCleanedData(newData);
    toast.success(`Removed ${removed} duplicate rows.`);
  };

  const handleRemoveNulls = () => {
    let newData = [...cleanedData];
    if (selectedCol === "all") {
      newData = newData.filter(row => 
        Object.values(row).every(v => v !== null && v !== undefined && v !== '')
      );
    } else {
      newData = newData.filter(row => 
        row[selectedCol] !== null && row[selectedCol] !== undefined && row[selectedCol] !== ''
      );
    }
    const removed = cleanedData.length - newData.length;
    setCleanedData(newData);
    toast.success(`Removed ${removed} rows with missing values.`);
  };

  const handleFillMissing = (method: 'mean' | 'median' | 'mode' | 'zero') => {
    if (selectedCol === "all") {
      toast.error("Please select a specific numeric column to fill missing values.");
      return;
    }
    
    const colType = columns.find(c => c.name === selectedCol)?.type;
    if (colType !== 'numeric' && method !== 'zero') { // simplified check
       toast.error("Fill method requires a numeric column.");
       return;
    }

    let fillValue: any = 0;
    const validValues = cleanedData
      .map(row => Number(row[selectedCol]))
      .filter(v => !isNaN(v));

    if (validValues.length > 0) {
      if (method === 'mean') fillValue = validValues.reduce((a,b)=>a+b,0) / validValues.length;
      else if (method === 'median') {
        const sorted = [...validValues].sort((a,b)=>a-b);
        fillValue = sorted[Math.floor(sorted.length/2)];
      }
    }

    const newData = cleanedData.map(row => {
      const val = row[selectedCol];
      if (val === null || val === undefined || val === '') {
        return { ...row, [selectedCol]: fillValue };
      }
      return row;
    });

    setCleanedData(newData);
    toast.success(`Filled missing values in ${selectedCol} with ${method} (${fillValue.toFixed(2)})`);
  };

  const handleReset = () => {
    setCleanedData(rawData);
    toast.success("Dataset reset to original state.");
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Data Cleaning Module</h2>
        <p className="text-muted-foreground">
          Prepare and clean your dataset for accurate analysis and machine learning.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Cleaning Actions */}
        <div className="glass-card rounded-xl p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Eraser className="h-5 w-5 text-primary" />
              Global Actions
            </h3>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset Dataset
            </Button>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div>
                <h4 className="font-medium">Remove Duplicates</h4>
                <p className="text-sm text-muted-foreground">Drop exact duplicate rows</p>
              </div>
              <Button onClick={handleRemoveDuplicates} variant="secondary">Apply</Button>
            </div>
          </div>

          <h3 className="text-xl font-semibold flex items-center gap-2 border-b border-white/10 pb-4 mt-2">
            <Trash2 className="h-5 w-5 text-orange-500" />
            Column Specific Actions
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Target Column</Label>
              <Select value={selectedCol} onValueChange={setSelectedCol}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select column..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Columns</SelectItem>
                  {columns.map(col => (
                    <SelectItem key={col.name} value={col.name}>
                      {col.name} ({col.missingCount} missing)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
              <div>
                <h4 className="font-medium">Remove Null Rows</h4>
                <p className="text-sm text-muted-foreground">Drop rows containing nulls</p>
              </div>
              <Button onClick={handleRemoveNulls} variant="destructive">Remove</Button>
            </div>

            <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-4">
              <div>
                <h4 className="font-medium">Fill Missing Values</h4>
                <p className="text-sm text-muted-foreground">Replace nulls with computed value</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => handleFillMissing('mean')}>Fill Mean</Button>
                <Button size="sm" variant="secondary" onClick={() => handleFillMissing('median')}>Fill Median</Button>
                <Button size="sm" variant="secondary" onClick={() => handleFillMissing('zero')}>Fill Zero</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="glass-card rounded-xl p-6 flex flex-col gap-6">
          <h3 className="text-xl font-semibold border-b border-white/10 pb-4">Dataset Status</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-sm text-muted-foreground mb-1">Current Rows</p>
              <p className="text-3xl font-bold">{cleanedData.length}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-sm text-muted-foreground mb-1">Original Rows</p>
              <p className="text-3xl font-bold text-muted-foreground">{rawData.length}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-sm text-muted-foreground mb-1">Total Missing</p>
              <p className="text-3xl font-bold text-orange-500">
                {columns.reduce((a,c)=>a+c.missingCount, 0)}
              </p>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-white/10 flex justify-end">
            <Button asChild>
              <Link to="/visualization" className="flex items-center gap-2">
                Continue to Visualization <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}