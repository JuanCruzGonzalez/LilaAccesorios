import { useRef, useState } from 'react';
import { ExcelColumn, downloadImportTemplate, exportToExcel, readExcelFile } from '../utils/excel';

interface ExcelActionsProps<T> {
  data: T[];
  columns: ExcelColumn<T>[];
  sheetName: string;
  fileName: string;
  onImport?: (rows: T[]) => void | Promise<void>;
  disableImport?: boolean;
  exportLabel?: string;
  importLabel?: string;
  /** If provided, enables "all records" and "range" export modes */
  onFetchAll?: () => Promise<T[]>;
}

type ExportMode = 'current' | 'all' | 'range';

interface ExportModalProps {
  dataCount: number;
  hasFetchAll: boolean;
  isLoading: boolean;
  onConfirm: (mode: ExportMode, from: number, to: number) => void;
  onCancel: () => void;
}

function ExportModal({ dataCount, hasFetchAll, isLoading, onConfirm, onCancel }: ExportModalProps) {
  const [mode, setMode] = useState<ExportMode>('current');
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(100);

  return (
    <div className="excel-modal-overlay" onClick={() => !isLoading && onCancel()}>
      <div className="excel-modal" onClick={e => e.stopPropagation()}>
        <div className="excel-modal-header">
          <span className="excel-modal-title">Opciones de exportación</span>
          <button className="excel-modal-close" onClick={() => !isLoading && onCancel()}>×</button>
        </div>
        <div className="excel-modal-body">
          <label className="excel-modal-option">
            <input
              type="radio"
              name="exportMode"
              checked={mode === 'current'}
              onChange={() => setMode('current')}
            />
            <span>
              Datos actuales&nbsp;
              <span className="excel-modal-count">({dataCount} registros)</span>
            </span>
          </label>
          {hasFetchAll && (
            <>
              <label className="excel-modal-option">
                <input
                  type="radio"
                  name="exportMode"
                  checked={mode === 'all'}
                  onChange={() => setMode('all')}
                />
                <span>Todos los registros</span>
              </label>
              <label className="excel-modal-option">
                <input
                  type="radio"
                  name="exportMode"
                  checked={mode === 'range'}
                  onChange={() => setMode('range')}
                />
                <span>Rango personalizado</span>
              </label>
              {mode === 'range' && (
                <div className="excel-modal-range">
                  <label className="excel-modal-range-label">
                    Desde
                    <input
                      type="number"
                      className="excel-modal-range-input"
                      value={from}
                      min={1}
                      onChange={e => setFrom(Math.max(1, Number(e.target.value)))}
                    />
                  </label>
                  <span className="excel-modal-range-sep">—</span>
                  <label className="excel-modal-range-label">
                    Hasta
                    <input
                      type="number"
                      className="excel-modal-range-input"
                      value={to}
                      min={from}
                      onChange={e => setTo(Math.max(from, Number(e.target.value)))}
                    />
                  </label>
                </div>
              )}
            </>
          )}
        </div>
        <div className="excel-modal-footer">
          <button className="btn-secondary" onClick={() => !isLoading && onCancel()} disabled={isLoading}>
            Cancelar
          </button>
          <button
            className="btn-excel-export"
            onClick={() => onConfirm(mode, from, to)}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Cargando...' : '📊 Exportar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ExcelActions<T>({
  data,
  columns,
  sheetName,
  fileName,
  onImport,
  disableImport = false,
  exportLabel = 'Exportar Excel',
  importLabel = 'Importar Excel',
  onFetchAll,
}: ExcelActionsProps<T>) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportConfirm = async (mode: ExportMode, from: number, to: number) => {
    setExportLoading(true);
    try {
      let rows: T[];
      if (mode === 'current') {
        rows = data;
      } else {
        const all = await onFetchAll!();
        rows = mode === 'range' ? all.slice(from - 1, to) : all;
      }
      exportToExcel(rows, columns, sheetName, fileName);
      setShowExportModal(false);
    } finally {
      setExportLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImport) return;
    setImportLoading(true);
    try {
      const rows = await readExcelFile<T>(file, columns);
      await onImport(rows);
    } finally {
      setImportLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <>
      <div className="excel-actions">
        <button
          className="btn-excel-export"
          onClick={() => setShowExportModal(true)}
          title="Exportar datos a Excel"
        >
          📊 {exportLabel}
        </button>
        {!disableImport && (
          <>
            <button
              className="btn-excel-template"
              onClick={() => downloadImportTemplate(columns, sheetName, fileName)}
              title="Descargar plantilla de importación"
            >
              📋 Plantilla
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button
              className="btn-excel-import"
              onClick={() => fileRef.current?.click()}
              disabled={importLoading}
            title="Importar datos desde Excel"
          >
              {importLoading ? '⏳ Importando...' : `📥 ${importLabel}`}
            </button>
          </>
        )}
      </div>
      {showExportModal && (
        <ExportModal
          dataCount={data.length}
          hasFetchAll={!!onFetchAll}
          isLoading={exportLoading}
          onConfirm={handleExportConfirm}
          onCancel={() => setShowExportModal(false)}
        />
      )}
    </>
  );
}
