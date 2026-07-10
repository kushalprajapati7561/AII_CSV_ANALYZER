import { useDataStore } from "@/store/useDataStore";
import { AlertCircle, Download, FileOutput, FileSpreadsheet, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function Report() {
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

  const handleDownloadCSV = () => {
    try {
      const csv = Papa.unparse(cleanedData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `cleaned_${fileInfo.name.replace(/\.[^/.]+$/, "")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV downloaded successfully!");
    } catch (e) {
      toast.error("Failed to generate CSV.");
    }
  };

  const handleDownloadExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(cleanedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Cleaned Data");
      XLSX.writeFile(workbook, `cleaned_${fileInfo.name.replace(/\.[^/.]+$/, "")}.xlsx`);
      toast.success("Excel file downloaded successfully!");
    } catch (e) {
      toast.error("Failed to generate Excel file.");
    }
  };

    const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(22);
      doc.text("AI CSV Analyzer - Analysis Report", 14, 20);
      
      // Dataset Info
      doc.setFontSize(14);
      doc.text("Dataset Overview", 14, 35);
      
      doc.setFontSize(11);
      doc.text(`File Name: ${fileInfo.name}`, 14, 45);
      doc.text(`Total Rows: ${cleanedData.length}`, 14, 52);
      doc.text(`Total Columns: ${columns.length}`, 14, 59);
      
      // Column summary table
      const tableData = columns.map(c => [c.name, c.type, c.missingCount.toString()]);
      
      autoTable(doc, {
        startY: 70,
        head: [['Column Name', 'Type', 'Missing Values']],
        body: tableData,
      });

      doc.save(`report_${fileInfo.name.replace(/\.[^/.]+$/, "")}.pdf`);
      toast.success("PDF report generated successfully!");
    } catch (e) {
      toast.error("Failed to generate PDF report.");
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <FileOutput className="h-8 w-8 text-primary" /> Report & Export
        </h2>
        <p className="text-muted-foreground">
          Download your cleaned dataset and comprehensive analysis reports.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {/* CSV Export */}
        <div className="glass-card rounded-xl p-8 flex flex-col items-center text-center gap-4 hover:bg-white/5 transition-colors group">
          <div className="bg-primary/20 p-4 rounded-full group-hover:scale-110 transition-transform">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Cleaned CSV</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Export the fully preprocessed dataset in standard CSV format.
            </p>
          </div>
          <Button onClick={handleDownloadCSV} className="w-full mt-auto" variant="secondary">
            <Download className="mr-2 h-4 w-4" /> Download CSV
          </Button>
        </div>

        {/* Excel Export */}
        <div className="glass-card rounded-xl p-8 flex flex-col items-center text-center gap-4 hover:bg-white/5 transition-colors group">
          <div className="bg-green-500/20 p-4 rounded-full group-hover:scale-110 transition-transform">
            <FileSpreadsheet className="h-8 w-8 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Cleaned Excel</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Export the preprocessed dataset as an XLSX spreadsheet.
            </p>
          </div>
          <Button onClick={handleDownloadExcel} className="w-full mt-auto" variant="secondary">
            <Download className="mr-2 h-4 w-4" /> Download Excel
          </Button>
        </div>

        {/* PDF Report */}
        <div className="glass-card rounded-xl p-8 flex flex-col items-center text-center gap-4 hover:bg-white/5 transition-colors group">
          <div className="bg-red-500/20 p-4 rounded-full group-hover:scale-110 transition-transform">
            <FileOutput className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Analysis PDF Report</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Download a comprehensive summary of statistics and insights.
            </p>
          </div>
          <Button onClick={handleDownloadPDF} className="w-full mt-auto" variant="secondary">
            <Download className="mr-2 h-4 w-4" /> Generate PDF
          </Button>
        </div>
      </div>
    </div>
  );
}