import * as XLSX from 'xlsx';

export interface ExcelColumn<T = any> {
  /** Key in the data object */
  key: string;
  /** Header label shown in Excel */
  header: string;
  /** Column width in characters (default 18) */
  width?: number;
  /** Transform value for export */
  format?: (val: any, row: T) => any;
  /** Transform raw cell value when importing */
  parseImport?: (val: any) => any;
  /** If true the column is skipped during import parsing */
  exportOnly?: boolean;
}

/**
 * Export an array of objects to an .xlsx file and trigger a browser download.
 */
export function exportToExcel<T>(
  data: T[],
  columns: ExcelColumn<T>[],
  sheetName: string,
  fileName: string,
): void {
  const headers = columns.map(c => c.header);
  const rows = data.map(item =>
    columns.map(col => {
      const val = (item as any)[col.key];
      return col.format ? col.format(val, item) : (val ?? '');
    }),
  );

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  ws['!cols'] = columns.map(c => ({ wch: c.width ?? 18 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

/**
 * Parse the first sheet of an .xlsx / .xls file.
 * The first row must be headers that match `column.header` values.
 * Returns typed objects for every non-empty data row.
 */
export function readExcelFile<T>(
  file: File,
  columns: ExcelColumn<T>[],
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const bytes = new Uint8Array(e.target!.result as ArrayBuffer);
        const wb = XLSX.read(bytes, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const allRows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (allRows.length < 2) {
          resolve([]);
          return;
        }

        const headerRow = (allRows[0] as any[]).map(h => String(h ?? '').trim());
        const importCols = columns.filter(c => !c.exportOnly);

        const result: T[] = [];
        for (let i = 1; i < allRows.length; i++) {
          const row = allRows[i];
          if (!row || row.every(cell => cell === undefined || cell === null || cell === '')) continue;

          const obj: any = {};
          for (const col of importCols) {
            const idx = headerRow.indexOf(col.header);
            const rawVal = idx !== -1 ? row[idx] : undefined;
            if (rawVal !== undefined && rawVal !== null && rawVal !== '') {
              obj[col.key] = col.parseImport ? col.parseImport(rawVal) : rawVal;
            }
          }
          result.push(obj as T);
        }
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Download an empty template file with only the importable header row.
 */
export function downloadImportTemplate<T>(
  columns: ExcelColumn<T>[],
  sheetName: string,
  fileName: string,
): void {
  exportToExcel([], columns.filter(c => !c.exportOnly), sheetName, `${fileName}_plantilla`);
}
