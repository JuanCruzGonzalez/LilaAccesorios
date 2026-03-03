import React, { useState, useMemo } from 'react';
import { usePedidos } from './context/PedidosContext';
import { ModalDetallePedido } from './components/ModalDetallePedido';
import { formatPrice, formatDate } from '../../shared/utils';
import { EstadoPedido } from '../../core/types';
import CargandoPage from '../../shared/components/CargandoPage';
import Page from '../../shared/components/Page';
import Card from '../../shared/components/Card';
import { getEstadoBadgeClass, getEstadoTexto } from './services/pedidoService';
import BotonEstado from './components/BotonEstado';
import { AceptarIcon, CancelarIcon, EntregarIcon } from './components/Iconos';
import H1 from '../../shared/components/H1';

export const PedidosPage: React.FC = () => {
  const {
    pedidos,
    isLoading,
    contadorPendientes,
    metricasHoy,
    handleVerPedido,
    handleCambiarEstado,
    handleBuscarPedidos,
    handleAutoCancelar,
  } = usePedidos();

  const [filtroEstado, setFiltroEstado] = useState<'all' | EstadoPedido>('all');
  const [busqueda, setBusqueda] = useState('');
  const [pedidosFiltrados, setPedidosFiltrados] = useState(pedidos);

  // Filtrar pedidos
  useMemo(() => {
    let resultado = pedidos;

    // Filtro por estado
    if (filtroEstado !== 'all') {
      resultado = resultado.filter(p => p.estado === filtroEstado);
    }

    setPedidosFiltrados(resultado);
  }, [pedidos, filtroEstado]);

  // Buscar
  const handleBuscar = async () => {
    if (busqueda.trim()) {
      const resultados = await handleBuscarPedidos(busqueda);
      setPedidosFiltrados(filtroEstado === 'all'
        ? resultados
        : resultados.filter(p => p.estado === filtroEstado)
      );
    } else {
      setPedidosFiltrados(filtroEstado === 'all'
        ? pedidos
        : pedidos.filter(p => p.estado === filtroEstado)
      );
    }
  };

  const getBotonesAccion = (pedido: any) => {
    const { id_pedido, estado } = pedido;

    if (estado === 'RECIBIDO') {
      return (
        <>
          <BotonEstado onClick={() => handleCambiarEstado(id_pedido, 'ACEPTADO')} id_pedido={id_pedido} clase="success" icon={<AceptarIcon />} />
          <BotonEstado onClick={() => handleCambiarEstado(id_pedido, 'CANCELADO')} id_pedido={id_pedido} clase="danger" icon={<CancelarIcon />}/>
        </>
      );
    }

    if (estado === 'ACEPTADO') {
      return (
        <>
          <BotonEstado onClick={() => handleCambiarEstado(id_pedido, 'ENTREGADO')} id_pedido={id_pedido} clase="primary" icon={<EntregarIcon />}/>
          <BotonEstado onClick={() => handleCambiarEstado(id_pedido, 'CANCELADO')} id_pedido={id_pedido} clase="danger" icon={<CancelarIcon />}/>
        </>
      );
    }

    return null; // ENTREGADO y CANCELADO no tienen acciones
  };

  if (isLoading) {
    return (
      <CargandoPage mensaje="pedidos" />
    );
  }

  return (
    <Page>
      <div className="page-header">
        <div>
          <H1 texto="Pedidos" />
          <p className="page-subtitle">Gestiona los pedidos de clientes</p>
        </div>
        <button className="btn-secondary" onClick={handleAutoCancelar}>
          🗑️ Auto-cancelar Vencidos
        </button>
      </div>

      {/* Métricas */}
      {metricasHoy && (
        <div className="stats-grid">
          <div className="stat-card-minimal">
            <div className="stat-label">Pedidos Pendientes</div>
            <div className="stat-value stat-warning">{contadorPendientes}</div>
          </div>
          <div className="stat-card-minimal">
            <div className="stat-label">Pedidos Hoy</div>
            <div className="stat-value">{metricasHoy.total}</div>
          </div>
          <div className="stat-card-minimal">
            <div className="stat-label">Entregados Hoy</div>
            <div className="stat-value stat-success">{metricasHoy.entregados}</div>
          </div>
          <div className="stat-card-minimal">
            <div className="stat-label">Ventas Hoy</div>
            <div className="stat-value">{formatPrice(metricasHoy.totalVentas)}</div>
          </div>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <Card>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', paddingRight: '24px', padding: '24px' }}>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as any)}
            style={{ padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px', color: '#333' }}
          >
            <option value="all">Todos los estados</option>
            <option value="RECIBIDO">Recibidos</option>
            <option value="ACEPTADO">Aceptados</option>
            <option value="ENTREGADO">Entregados</option>
            <option value="CANCELADO">Cancelados</option>
          </select>

          <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Buscar por #pedido, teléfono o nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              style={{ flex: 1, padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px', color: '#333' }}
            />
            <button className="btn-primary" onClick={handleBuscar}>
              Buscar
            </button>
            {busqueda && (
              <button
                className="btn-secondary"
                onClick={() => {
                  setBusqueda('');
                  setPedidosFiltrados(filtroEstado === 'all' ? pedidos : pedidos.filter(p => p.estado === filtroEstado));
                }}
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#Pedido</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Teléfono</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    No hay pedidos para mostrar
                  </td>
                </tr>
              ) : (
                pedidosFiltrados.map(pedido => (
                  <tr key={pedido.id_pedido}>
                    <td className="font-medium">#{pedido.id_pedido}</td>
                    <td>{formatDate(pedido.fecha_pedido)}</td>
                    <td>{pedido.cliente_nombre}</td>
                    <td>{pedido.cliente_telefono}</td>
                    <td className="font-medium">{formatPrice(pedido.total)}</td>
                    <td>
                      <span className={getEstadoBadgeClass(pedido.estado)}>
                        {getEstadoTexto(pedido.estado)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-sm btn-secondary"
                          onClick={() => handleVerPedido(pedido)}
                          title="Ver detalle"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                        {getBotonesAccion(pedido)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ModalDetallePedido />
    </Page>
  );
};
