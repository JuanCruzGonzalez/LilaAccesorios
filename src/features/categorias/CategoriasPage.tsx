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
          <h1 className="page-title">Categorías</h1>
          <p className="page-subtitle">Gestiona las categorías de productos</p>
        </div>
        <button className="btn-primary" onClick={handleNuevaCategoria}>
          + Nueva Categoría
        </button>
      </div>

      <Estadisticas categorias={categorias} categoriasActivas={categoriasActivas} />

      <Filtros filtroEstado={filtroEstado} handleFiltroChange={handleFiltroChange} />
      <Card>
        <TableCategorias categoriasFiltradas={categoriasFiltradas} handleEditarCategoria={handleEditarCategoria} handleToggleCategoriaEstado={handleToggleCategoriaEstado}/>
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
