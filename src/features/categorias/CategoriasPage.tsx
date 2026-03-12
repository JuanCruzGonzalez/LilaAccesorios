import React, { useState } from 'react';
import { useCategorias } from './context/CategoriasContext';
import { ModalCategoria } from './components/ModalCategoria';
import CargandoPage from '../../shared/components/CargandoPage';
import Page from '../../shared/components/Page';
import Estadisticas from './components/Estadisticas';
import './styles/CategoriasPage.css';
import Filtros from './components/Filtros';
import Card from '../../shared/components/Card';
import TableCategorias from './components/TableCategorias';
import H1 from '../../shared/components/H1';
import { ExcelActions } from '../../shared/components/ExcelActions';
import { ExcelColumn } from '../../shared/utils/excel';
import { bulkCreateCategorias, getCategorias } from './services/categoriaService';
import { useToast } from '../../shared/hooks/useToast';
import { Categoria } from '../../core/types';

const CATEGORIAS_COLUMNS: ExcelColumn<Categoria>[] = [
  { key: 'id_categoria', header: 'ID', exportOnly: true, width: 8 },
  { key: 'nombre', header: 'Nombre', width: 30 },
  { key: 'estado', header: 'Estado', width: 10, format: v => (v ? 'Activo' : 'Inactivo'), parseImport: v => String(v).toLowerCase() === 'activo' || v === true || v === 1 },
  { key: 'id_categoria_padre', header: 'ID Categoría Padre', width: 20, parseImport: v => (v ? Number(v) : null) },
];

export const CategoriasPage: React.FC = () => {
  const {
    categorias,
    isLoading,
    categoriaToEdit,
    modalCategoria,
    handleNuevaCategoria,
    handleEditarCategoria,
    handleToggleCategoriaEstado,
    handleSubmitCategoria
  } = useCategorias();
  const { showSuccess, showError } = useToast();
  const [filtroEstado, setFiltroEstado] = useState<'all' | 'activo' | 'inactivo'>('all');

  if (isLoading) {
    return (
      <CargandoPage mensaje="categorías" />
    );
  }

  const categoriasFiltradas = categorias.filter(c => {
    if (filtroEstado === 'activo') return c.estado === true;
    if (filtroEstado === 'inactivo') return c.estado === false;
    return true;
  });

  const categoriasActivas = categorias.filter(c => c.estado === true);

  const handleFiltroChange = (value: 'all' | 'activo' | 'inactivo') => {
    setFiltroEstado(value);
  }
  return (
    <Page>
      <div className="page-header">
        <div>
          <H1 texto="Categorías" />
          <p className="page-subtitle">Gestiona las categorías de productos</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={handleNuevaCategoria}>
            + Nueva Categoría
          </button>
        </div>
      </div>
      <ExcelActions<Categoria>
        data={categorias}
        columns={CATEGORIAS_COLUMNS}
        sheetName="Categorías"
        fileName="categorias"
        onFetchAll={getCategorias}
        onImport={async rows => {
          try {
            const n = await bulkCreateCategorias(rows);
            showSuccess(`${n} categoría(s) importada(s) correctamente`);
          } catch {
            showError('Error al importar categorías');
          }
        }}
      />

      <Estadisticas categorias={categorias} categoriasActivas={categoriasActivas} />

      <Filtros filtroEstado={filtroEstado} handleFiltroChange={handleFiltroChange} />
      <Card>
        <TableCategorias categoriasFiltradas={categoriasFiltradas} handleEditarCategoria={handleEditarCategoria} handleToggleCategoriaEstado={handleToggleCategoriaEstado} />
      </Card>


      <ModalCategoria
        isOpen={modalCategoria.isOpen}
        onClose={modalCategoria.close}
        onSubmit={handleSubmitCategoria}
        initialCategoria={categoriaToEdit}
        categorias={categorias}
      />
    </Page>
  );
};
