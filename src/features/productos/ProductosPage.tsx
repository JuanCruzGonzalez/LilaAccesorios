import { useEffect, useState } from 'react';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { useProductos } from './context/ProductosContext';
import { Pagination } from '../../shared/components/Pagination';
import { ModalNuevoProducto } from './components/ModalNuevoProducto';
import { ModalActualizarStock } from '../stock/componentes/ModalActualizarStock';
import { useCategorias } from '../categorias/context/CategoriasContext';
import Page from '../../shared/components/Page';
import Card from '../../shared/components/Card';
import H1 from '../../shared/components/H1';
import SelectProductos from './components/selectProductos';
import TablaProductos from './components/TablaProductos';
import Buscador from './components/Buscador';
import EstadisticasGrid from './components/EstadisticasGrid';
import ModalVerProducto from './components/ModalVerProducto';
import { ExcelActions } from '../../shared/components/ExcelActions';
import { ExcelColumn } from '../../shared/utils/excel';
import { bulkCreateProductos, getProductos } from './services/productoService';
import { useToast } from '../../shared/hooks/useToast';
import { Producto } from '../../core/types';

const PRODUCTOS_COLUMNS: ExcelColumn<Producto>[] = [
  { key: 'id_producto', header: 'ID', exportOnly: true, width: 8 },
  { key: 'nombre', header: 'Nombre', width: 30 },
  { key: 'descripcion', header: 'Descripción', width: 40 },
  { key: 'stock', header: 'Stock', width: 10, parseImport: Number },
  { key: 'costo', header: 'Costo', width: 12, parseImport: Number },
  { key: 'precioventa', header: 'Precio Venta', width: 14, parseImport: Number },
  { key: 'precio_promocion', header: 'Precio Promocional', width: 20, parseImport: v => (v != null && v !== '' ? Number(v) : null) },
  { key: 'estado', header: 'Estado', width: 10, format: v => (v ? 'Activo' : 'Inactivo'), parseImport: v => String(v).toLowerCase() === 'activo' || v === true || v === 1 },
  { key: 'condicion', header: 'Condición', width: 16 },
  { key: 'accesorio', header: 'Accesorio', width: 12, format: v => (v ? 'Sí' : 'No'), parseImport: v => ['sí', 'si', 'yes', '1', 1, true].includes(typeof v === 'string' ? v.toLowerCase() : v) },
  { key: 'destacado', header: 'Destacado', width: 12, format: v => (v ? 'Sí' : 'No'), parseImport: v => ['sí', 'si', 'yes', '1', 1, true].includes(typeof v === 'string' ? v.toLowerCase() : v) },
  { key: 'dolares', header: 'En USD', width: 10, format: v => (v ? 'Sí' : 'No'), parseImport: v => ['sí', 'si', 'yes', '1', 1, true].includes(typeof v === 'string' ? v.toLowerCase() : v) },
];

export default function ProductosPage({ accesorio }: { accesorio: boolean }) {
  const {
    productos,
    productosTotal,
    productosPageNum,
    productosSearchQuery,
    PAGE_SIZE,
    loadProductosPage,
    handleBuscarProductos,
    modalNuevoProducto,
    openEditarProducto,
    setTipoProductoActual,
  } = useProductos();

  const { categorias } = useCategorias();
  const { showSuccess, showError } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const handlerStatusFilterChange = (value: 'all' | 'active' | 'inactive') => {
    setStatusFilter(value);
  }

  const debounced = useDebounce(searchTerm, 300);

  // Establecer que estamos en accesorios al montar
  useEffect(() => {
    setTipoProductoActual(accesorio ? 'accesorio' : 'telefono');
  }, [setTipoProductoActual, accesorio]);

  useEffect(() => {
    if (debounced !== productosSearchQuery) {
      handleBuscarProductos(debounced);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const stockBajo = productos.filter(p => p.stock < 10).length;

  return (
    <Page>
      <div className="page-header">
        <div>
          <H1 texto={accesorio ? 'Accesorios' : 'Teléfonos'} />
          <p className="page-subtitle">Administra tu catálogo de {accesorio ? 'accesorios' : 'teléfonos'}</p>
        </div>
        <button className="btn-primary" onClick={() => modalNuevoProducto.open()}>
          + Nuevo {accesorio ? 'Accesorio' : 'Teléfono'}
        </button>
      </div>

      <ExcelActions<Producto>
        data={productos}
        columns={PRODUCTOS_COLUMNS}
        sheetName="Productos"
        fileName={accesorio ? 'accesorios' : 'telefonos'}
        onFetchAll={async () => (await getProductos()).filter(p => p.accesorio === accesorio)}
        onImport={async rows => {
          try {
            const n = await bulkCreateProductos(rows);
            showSuccess(`${n} producto(s) importado(s) correctamente`);
            loadProductosPage(1);
          } catch {
            showError('Error al importar productos');
          }
        }}
      />
      <EstadisticasGrid productosTotal={productosTotal} stockBajo={stockBajo} accesorio={accesorio} />

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Buscador searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <SelectProductos statusFilter={statusFilter} handlerStatusFilterChange={handlerStatusFilterChange} />
      </div>
      <Pagination
        currentPage={productosPageNum}
        totalItems={productosTotal}
        pageSize={PAGE_SIZE}
        onPageChange={loadProductosPage}
      />
      <Card>
        <TablaProductos productos={productos} openEditarProducto={openEditarProducto} statusFilter={statusFilter} />
      </Card>
      <Pagination
        currentPage={productosPageNum}
        totalItems={productosTotal}
        pageSize={PAGE_SIZE}
        onPageChange={loadProductosPage}
      />

      {/* Modales */}
      <ModalNuevoProducto
        categorias={categorias}
      />
      <ModalActualizarStock />
      <ModalVerProducto />
    </Page>
  );
};
