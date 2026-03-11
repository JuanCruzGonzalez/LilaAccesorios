import { useEffect, useState } from "react";
import { getProductImageUrl } from "../../../shared/services/storageService";
import { useProductos } from "../context/ProductosContext";
import { formatPriceLocale } from "../../../shared/utils/formatters";
import '../styles/ModalVerProducto.css';

const CONDICION_LABEL: Record<string, string> = {
    nuevo: 'Nuevo',
    usado_premium: 'Usado premium',
    usado: 'Usado',
};

export default function ModalVerProducto() {
    const { productoVista, modalVerProducto, openEditarProducto, handleToggleProductoEstado } = useProductos();
    const [selectedIdx, setSelectedIdx] = useState(0);

    useEffect(() => {
        setSelectedIdx(0);
    }, [productoVista?.id_producto]);

    if (!productoVista) return null;

    const imagenes = productoVista.imagenes ?? [];
    const imagenActual = imagenes[selectedIdx] ?? imagenes[0] ?? null;
    const condicionLabel = productoVista.condicion ? CONDICION_LABEL[productoVista.condicion] : null;
    const esUsado = productoVista.condicion === 'usado' || productoVista.condicion === 'usado_premium';

    const handleEditarProducto= () => {
        openEditarProducto(productoVista)
        modalVerProducto.close()
    }
    return (
        <div className="mvp-overlay" onClick={modalVerProducto.close}>
            <div className="mvp-shell" onClick={e => e.stopPropagation()}>

                <div className="mvp-header">
                    <div className="mvp-header-copy">
                        <div className="mvp-eyebrow">Panel de administración</div>
                        <div className="mvp-title">Detalle de producto</div>
                    </div>
                    <button className="mvp-close-btn" onClick={modalVerProducto.close}>×</button>
                </div>

                <div className="mvp-content">
                    <div className="mvp-gallery-panel">
                        <div className="mvp-main-image-card">
                            {imagenActual ? (
                                <img
                                    className="mvp-main-image"
                                    src={getProductImageUrl(imagenActual.imagen_path) || undefined}
                                    alt={productoVista.nombre}
                                />
                            ) : (
                                <div className="mvp-no-image">Sin imagen</div>
                            )}
                            <div className="mvp-image-caption">
                                <div className="mvp-caption-label">ID</div>
                                <div className="mvp-caption-value">#{productoVista.id_producto}</div>
                            </div>
                        </div>

                        {imagenes.length > 0 && (
                            <div className="mvp-thumb-row">
                                {imagenes.map((img, idx) => (
                                    <div
                                        key={img.id_producto_imagen}
                                        className={`mvp-thumb-card${selectedIdx === idx ? ' mvp-thumb-card-active' : ''}`}
                                        onClick={() => setSelectedIdx(idx)}
                                    >
                                        <img
                                            src={getProductImageUrl(img.imagen_path) || undefined}
                                            alt={productoVista.nombre}
                                        />
                                        {img.es_principal && <div className="mvp-thumb-badge">Principal</div>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mvp-details-panel">
                        <div className="mvp-product-summary">
                            <div className="mvp-title-row">
                                <div className="mvp-title-block">
                                    <h1 className="mvp-product-name">{productoVista.nombre}</h1>
                                    {productoVista.descripcion && (
                                        <div className="mvp-product-description">{productoVista.descripcion}</div>
                                    )}
                                </div>
                                <div className="mvp-status-stack">
                                    <div className={productoVista.estado ? 'mvp-badge mvp-badge-success' : 'mvp-badge mvp-badge-error'}>
                                        {productoVista.estado ? 'Activo' : 'Inactivo'}
                                    </div>
                                    {condicionLabel && (
                                        <div className={esUsado ? 'mvp-badge mvp-badge-warning' : 'mvp-badge mvp-badge-muted'}>
                                            {condicionLabel}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mvp-price-grid">
                                <div className="mvp-price-card">
                                    <div className="mvp-price-label">Precio de costo</div>
                                    <div className="mvp-price-value">{formatPriceLocale(productoVista.costo)}</div>
                                </div>
                                <div className="mvp-price-card">
                                    <div className="mvp-price-label">Precio de venta</div>
                                    <div className="mvp-price-value">{formatPriceLocale(productoVista.precioventa)}</div>
                                </div>
                                {productoVista.precio_promocion != null && (
                                    <div className="mvp-price-card">
                                        <div className="mvp-price-label">Precio promocional</div>
                                        <div className="mvp-price-value">{formatPriceLocale(productoVista.precio_promocion)}</div>
                                    </div>
                                )}
                            </div>

                            <div className="mvp-info-grid">
                                <div className="mvp-info-card">
                                    <div className="mvp-info-label">Stock</div>
                                    <div className="mvp-info-value">{productoVista.stock} unidades</div>
                                </div>
                                {productoVista.destacado && (
                                    <div className="mvp-info-card">
                                        <div className="mvp-info-label">Producto destacado</div>
                                        <div className="mvp-info-value">
                                            {productoVista.orden_destacado != null ? `Posición ${productoVista.orden_destacado}` : 'Sí'}
                                        </div>
                                    </div>
                                )}
                                <div className="mvp-info-card">
                                    <div className="mvp-info-label">Estado</div>
                                    <div className="mvp-info-value">{productoVista.estado ? 'Activo' : 'Inactivo'}</div>
                                </div>
                                {condicionLabel && (
                                    <div className="mvp-info-card">
                                        <div className="mvp-info-label">Condición</div>
                                        <div className="mvp-info-value">{condicionLabel}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {productoVista.categorias && productoVista.categorias.length > 0 && (
                            <div className="mvp-section-block">
                                <div className="mvp-section-title">Categorías asociadas</div>
                                <div className="mvp-category-list">
                                    {productoVista.categorias.map(cat => (
                                        <div key={cat.id_categoria} className="mvp-category-pill">{cat.nombre}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mvp-footer">
                            <button
                                className="mvp-btn mvp-btn-outline"
                                onClick={() => handleToggleProductoEstado(productoVista)}
                            >
                                {productoVista.estado ? 'Desactivar producto' : 'Activar producto'}
                            </button>
                            <button
                                className="mvp-btn mvp-btn-primary"
                                onClick={handleEditarProducto}
                            >
                                Editar producto
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}