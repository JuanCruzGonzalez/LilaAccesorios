import React from 'react';
import { Producto } from '../../../core/types';
import { usePromociones } from '../context/PromocionesContext';
import { getPromocionImageUrl } from '../../../shared/services/storageService';
import { formatPriceLocale } from '../../../shared/utils/formatters';
import '../styles/modalverpromocion.css';

interface ModalVerPromocionProps {
  productosCatalogo: Producto[];
}

export const ModalVerPromocion: React.FC<ModalVerPromocionProps> = ({ productosCatalogo }) => {
  const { modalVerPromocion, promocionVista, promocionVistaDetalles, handleChangePromocion, handleEditarPromocion } = usePromociones();

  if (!modalVerPromocion.isOpen || !promocionVista) return null;

  const resolveNombre = (id_producto: number) => {
    const p = productosCatalogo.find(x => x.id_producto === id_producto);
    return p ? p.nombre : `#${id_producto}`;
  };

  const buttonHandleEditarPromocion = () => {
    handleEditarPromocion(promocionVista)
    modalVerPromocion.close()
  }

  const imagenUrl = getPromocionImageUrl(promocionVista.imagen_path ?? null);

  return (
    <div className="vpr-overlay" onClick={modalVerPromocion.close}>
      <div className="vpr-shell" onClick={e => e.stopPropagation()}>

        <div className="vpr-header">
          <div className="vpr-header-copy">
            <div className="vpr-eyebrow">Panel de administración</div>
            <div className="vpr-title">Detalle de Promoción</div>
          </div>
          <button className="vpr-close-btn" onClick={modalVerPromocion.close}>×</button>
        </div>

        <div className="vpr-content">
          <div className="vpr-image-panel">
            <div className="vpr-image-card">
              {imagenUrl ? (
                <img className="vpr-promo-image" src={imagenUrl} alt={promocionVista.name} />
              ) : (
                <div className="vpr-no-image">Sin imagen</div>
              )}
              <div className="vpr-image-meta">
                <div className="vpr-image-meta-label">ID</div>
                <div className="vpr-image-meta-value">#{promocionVista.id_promocion}</div>
              </div>
            </div>
          </div>

          <div className="vpr-details-panel">
            <div className="vpr-summary-card">
              <div className="vpr-title-row">
                <div className="vpr-name-block">
                  <h1 className="vpr-promo-name">{promocionVista.name}</h1>
                </div>
                <div className={promocionVista.estado ? 'vpr-status-badge vpr-badge-success' : 'vpr-status-badge vpr-badge-error'}>
                  {promocionVista.estado ? 'Activa' : 'Inactiva'}
                </div>
              </div>

              <div className="vpr-price-row">
                <div className="vpr-price-block">
                  <div className="vpr-price-label">Precio promocional</div>
                  <div className="vpr-promo-price">
                    {promocionVista.precio != null ? formatPriceLocale(promocionVista.precio) : 'Sin precio'}
                  </div>
                </div>
              </div>

              <div className="vpr-info-grid">
                <div className="vpr-info-card">
                  <div className="vpr-info-label">Estado</div>
                  <div className="vpr-info-value">{promocionVista.estado ? 'Activa' : 'Inactiva'}</div>
                </div>
                <div className="vpr-info-card">
                  <div className="vpr-info-label">Productos</div>
                  <div className="vpr-info-value">{promocionVistaDetalles.length} incluidos</div>
                </div>
              </div>
            </div>

            <div className="vpr-section-block">
              <div className="vpr-section-title">Productos incluidos</div>
              {promocionVistaDetalles.length === 0 ? (
                <div className="vpr-empty">No hay productos en esta promoción</div>
              ) : (
                <div className="vpr-products-list">
                  {promocionVistaDetalles.map(d => (
                    <div key={d.id_detalle_promocion} className="vpr-product-item">
                      <div className="vpr-product-left">
                        <div className="vpr-product-icon">📦</div>
                        <div className="vpr-product-meta">
                          <div className="vpr-product-name">{resolveNombre(d.id_producto)}</div>
                          <div className="vpr-product-note">Producto individual incluido en la promoción</div>
                        </div>
                      </div>
                      <div className="vpr-product-qty">x{d.cantidad}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="vpr-footer">
              <button
                className="vpr-btn vpr-btn-outline"
                onClick={() => handleChangePromocion(promocionVista.id_promocion, !promocionVista.estado)}
              >
                {promocionVista.estado ? 'Desactivar' : 'Activar'}
              </button>
              <button
                className="vpr-btn vpr-btn-primary"
                onClick={buttonHandleEditarPromocion}
              >
                Editar promoción
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVerPromocion;
