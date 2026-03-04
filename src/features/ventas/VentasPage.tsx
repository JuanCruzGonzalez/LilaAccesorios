import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/queryClient';
import { VentaConDetalles } from '../../core/types';
import { Pagination } from '../../shared/components/Pagination';
import { useVentas } from './context/VentasContext';
import { ModalNuevaVenta } from './components/ModalNuevaVenta';
import { ModalCotizacionDolar } from './components/ModalCotizacionDolar';
import { getProductosActivos } from '../productos/services/productoService';
import { getPromocionesActivas } from '../promociones/services/promocionService';
import { useToast } from '../../shared/hooks/useToast';
import { useModal } from '../../shared/hooks/useModal';
import Page from '../../shared/components/Page';
import PageHeader from '../../shared/components/PageHeader';
import Card from '../../shared/components/Card';
import TablaVentas from './components/TablaVentas';
import ModalVentaDetalle from './components/ModalVentaDetalle';
import Filtros from './components/Filtros';

export const VentasPage: React.FC = () => {
  const {
    ventas,
    ventasTotal,
    ventasPageNum,
    PAGE_SIZE,
    loadVentasPage,
    modalNuevaVenta,
    handleToggleVentaFlag,
    handleBuscarVentas,
  } = useVentas();

  const { showError, showWarning } = useToast();
  const modalCotizacion = useModal();

  const { data: productosActivos = [] } = useQuery({
    queryKey: queryKeys.productosActivos,
    queryFn: getProductosActivos,
    staleTime: 1000 * 60 * 5,
  });

  const { data: promocionesActivas = [] } = useQuery({
    queryKey: queryKeys.promocionesActivas,
    queryFn: getPromocionesActivas,
    staleTime: 1000 * 60 * 5,
  });

  // Query separada para métricas del mes actual (independiente de la paginación)
  const [desde, setDesde] = useState<string>('');
  const [hasta, setHasta] = useState<string>('');
  const [estadoFilter, setEstadoFilter] = useState<'all' | 'pagada' | 'pendiente' | 'baja'>('all');

  const handleSetDesde = (value: string) => {
    setDesde(value);
  }

  const handleSetHasta = (value: string) => {
    setHasta(value);
  }

  const handleSetEstadoFilter = (value: 'all' | 'pagada' | 'pendiente' | 'baja') => {
    setEstadoFilter(value);
  }

  const [ventaSeleccionada, setVentaSeleccionada] = useState<VentaConDetalles | null>(null);

  const handleSetVentaSeleccionada = (venta: VentaConDetalles | null) => {
    setVentaSeleccionada(venta);
  }
  return (
    <Page>
      <PageHeader funcion={modalNuevaVenta.open} textButton='Nueva Venta' title='Ventas' subtitle='Gestiona el historial de ventas'/>
      <button
        className="btn-secondary btn-dollar"
        onClick={modalCotizacion.open}
        title="Gestionar cotización del dólar"
      >
        💵 Dólar
      </button>

      <Filtros
        desde={desde}
        hasta={hasta}
        estadoFilter={estadoFilter}
        handleBuscarVentas={handleBuscarVentas}
        handleSetDesde={handleSetDesde}
        handleSetHasta={handleSetHasta}
        handleSetEstadoFilter={handleSetEstadoFilter}
      />

      {/* Pager */}
      <Pagination
        currentPage={ventasPageNum}
        totalItems={ventasTotal}
        pageSize={PAGE_SIZE}
        onPageChange={(p, e) => loadVentasPage(p, e)}
        extra={{
          desde: desde || undefined,
          hasta: hasta || undefined,
          estado: estadoFilter === 'pagada' ? true : estadoFilter === 'pendiente' ? false : undefined,
          baja: estadoFilter === 'baja' ? true : false
        }}
      />
      <Card>
        <TablaVentas ventas={ventas} handleSetVentaSeleccionada={handleSetVentaSeleccionada} handleToggleVentaFlag={handleToggleVentaFlag} />
      </Card>
      <Pagination
        currentPage={ventasPageNum}
        totalItems={ventasTotal}
        pageSize={PAGE_SIZE}
        onPageChange={(p, e) => loadVentasPage(p, e)}
        extra={{
          desde: desde || undefined,
          hasta: hasta || undefined,
          estado: estadoFilter === 'pagada' ? true : estadoFilter === 'pendiente' ? false : undefined,
          baja: estadoFilter === 'baja' ? true : false
        }}
      />
      {/* Modal de Detalle */}
      {ventaSeleccionada && (
        <ModalVentaDetalle ventaSeleccionada={ventaSeleccionada} handleSetVentaSeleccionada={handleSetVentaSeleccionada} />
      )}

      {/* Modal */}
      <ModalNuevaVenta
        productos={productosActivos}
        promociones={promocionesActivas}
        showError={showError}
        showWarning={showWarning}
      />

      <ModalCotizacionDolar
        isOpen={modalCotizacion.isOpen}
        onClose={modalCotizacion.close}
      />
    </Page>
  );
}; 