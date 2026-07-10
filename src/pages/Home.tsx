import { useState, useCallback } from "react";
import { UploadCloud, FileSpreadsheet, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useDataStore } from "@/store/useDataStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const setFileData = useDataStore((state) => state.setFileData);
  const fileInfo = useDataStore((state) => state.fileInfo);
  const navigate = useNavigate();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 200 * 1024 * 1024) {
        toast.error("File size exceeds 200MB limit.");
        return;
      }

      setIsProcessing(true);
      const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
      const isCsv = file.name.endsWith(".csv");

      if (!isExcel && !isCsv) {
        toast.error("Invalid file format. Please upload CSV or Excel.");
        setIsProcessing(false);
        return;
      }

      try {
        if (isCsv) {
          Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => {
              setFileData(
                { name: file.name, size: file.size, type: "CSV" },
                results.data as any[]
              );
              toast.success("File uploaded successfully");
              setIsProcessing(false);
              navigate("/overview");
            },
            error: (error) => {
              toast.error(`Error parsing CSV: ${error.message}`);
              setIsProcessing(false);
            },
          });
        } else {
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: null });
            
            setFileData(
              { name: file.name, size: file.size, type: "Excel" },
              jsonData
            );
            toast.success("File uploaded successfully");
            setIsProcessing(false);
            navigate("/overview");
          };
          reader.onerror = () => {
            toast.error("Error reading Excel file.");
            setIsProcessing(false);
          };
          reader.readAsArrayBuffer(file);
        }
      } catch (error) {
        toast.error("An unexpected error occurred.");
        setIsProcessing(false);
      }
    },
    [setFileData, navigate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxFiles: 1,
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome to AI CSV Analyzer Pro</h2>
        <p className="text-muted-foreground">
          Upload your dataset to begin powerful data analysis, cleaning, visualization, and machine learning.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="glass-card rounded-xl p-6 flex items-start gap-4">
          <div className="bg-primary/20 p-3 rounded-lg text-primary">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Excel & CSV</h3>
            <p className="text-sm text-muted-foreground">Supported file formats</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 flex items-start gap-4">
          <div className="bg-green-500/20 p-3 rounded-lg text-green-500">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Up to 200MB</h3>
            <p className="text-sm text-muted-foreground">Maximum file size limit</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 flex items-start gap-4">
          <div className="bg-orange-500/20 p-3 rounded-lg text-orange-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Data Privacy</h3>
            <p className="text-sm text-muted-foreground">Processed entirely in your browser</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-1 md:p-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors duration-200 ease-in-out flex flex-col items-center justify-center min-h-[300px] ${
            isDragActive ? "border-primary bg-primary/5" : "border-white/20 hover:border-primary/50 hover:bg-white/5"
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className={`h-16 w-16 mb-4 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
          {isProcessing ? (
            <div className="text-xl font-semibold animate-pulse text-primary">Processing dataset...</div>
          ) : isDragActive ? (
            <div className="text-xl font-semibold text-primary">Drop the file here ...</div>
          ) : (
            <div className="space-y-2">
              <div className="text-xl font-semibold text-foreground">
                Drag & drop a file here, or click to select
              </div>
              <p className="text-sm text-muted-foreground">
                Supports .csv, .xlsx, .xls
              </p>
            </div>
          )}
        </div>
      </div>

      {fileInfo && (
        <div className="glass-card rounded-xl p-6 flex items-center justify-between mt-4 border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-4">
            <div className="bg-green-500/20 p-3 rounded-full text-green-500">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Current Dataset: {fileInfo.name}</h4>
              <p className="text-sm text-muted-foreground">
                {fileInfo.type} • {(fileInfo.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <CheckCircle2 className="h-6 w-6 text-green-500" />
        </div>
      )}
    </div>
  );
}