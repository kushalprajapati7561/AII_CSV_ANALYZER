import { create } from 'zustand';

export interface DataColumn {
  name: string;
  type: 'numeric' | 'categorical' | 'datetime';
  missingCount: number;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
}

export interface MLResult {
  type: 'Classification' | 'Regression';
  target: string;
  metrics: any[];
}

interface DataState {
  fileInfo: FileInfo | null;
  rawData: any[];
  cleanedData: any[];
  columns: DataColumn[];
  mlResults: MLResult | null;
  setFileData: (fileInfo: FileInfo, data: any[]) => void;
  setCleanedData: (data: any[]) => void;
  setMlResults: (results: MLResult | null) => void;
  reset: () => void;
}

function detectColumnType(values: any[]): 'numeric' | 'categorical' | 'datetime' {
  const nonNullValues = values.filter((v) => v !== null && v !== undefined && v !== '');
  if (nonNullValues.length === 0) return 'categorical';

  // Check if mostly numeric
  const numericCount = nonNullValues.filter((v) => !isNaN(Number(v))).length;
  if (numericCount / nonNullValues.length > 0.8) return 'numeric';

  // Check if mostly datetime (simple check)
  const dateCount = nonNullValues.filter((v) => !isNaN(Date.parse(String(v)))).length;
  if (dateCount / nonNullValues.length > 0.8) return 'datetime';

  return 'categorical';
}

export const useDataStore = create<DataState>((set) => ({
  fileInfo: null,
  rawData: [],
  cleanedData: [],
  columns: [],
  mlResults: null,

  setFileData: (fileInfo, data) => {
    if (data.length === 0) {
      set({ fileInfo, rawData: [], cleanedData: [], columns: [], mlResults: null });
      return;
    }

    const colNames = Object.keys(data[0]);
    const columns: DataColumn[] = colNames.map((name) => {
      const values = data.map((row) => row[name]);
      const missingCount = values.filter((v) => v === null || v === undefined || v === '').length;
      return {
        name,
        type: detectColumnType(values),
        missingCount,
      };
    });

    set({ fileInfo, rawData: data, cleanedData: data, columns, mlResults: null });
  },

  setCleanedData: (data) => {
    if (data.length === 0) {
      set({ cleanedData: [] });
      return;
    }
    const colNames = Object.keys(data[0]);
    const columns: DataColumn[] = colNames.map((name) => {
      const values = data.map((row) => row[name]);
      const missingCount = values.filter((v) => v === null || v === undefined || v === '').length;
      return {
        name,
        type: detectColumnType(values),
        missingCount,
      };
    });
    set({ cleanedData: data, columns });
  },

  setMlResults: (results) => set({ mlResults: results }),

  reset: () => set({ fileInfo: null, rawData: [], cleanedData: [], columns: [], mlResults: null }),
}));
