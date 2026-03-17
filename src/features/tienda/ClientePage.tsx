import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Producto } from '../../core/types';
import { getProductosActivos } from '../productos/services/productoService';
import { useProductosDestacados } from './hooks/useProductosDestacados';
import { usePromocionesActivas } from './hooks/usePromocionesActivas';
import { PromocionesDestacadas } from './components/PromocionesDestacadas';
import { formatPrice, generateProductUrl } from '../../shared/utils';
import { getProductImageUrl } from '../../shared/services/storageService';
import './styles/clientepage.css';

export const ClientePage: React.FC = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await getProductosActivos();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Productos destacados desde hook compartido
  const { productosDestacados } = useProductosDestacados();

  // Promociones activas para mostrar en home
  const { promociones } = usePromocionesActivas();

  // Obtener accesorios (productos donde accesorio === true)
  const productosAccesorios = useMemo(() => {
    return productos
      .filter(p => p.accesorio === true && p.stock > 0)
      .slice(0, 8);
  }, [productos]);

  const handleVerDetalleProducto = (producto: Producto) => {
    const productUrl = generateProductUrl(producto.id_producto!, producto.nombre);
    navigate(`/producto/${productUrl}`);
  };

  if (loading) {
    return (
      <div className="lila-loading">
        <div className="lila-loading-spinner"></div>
        <p className="lila-loading-text">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="lila-page">

      {/* Hero */}
      <section className="lila-hero">
        <div className="lila-hero-inner">
          <div className="lila-hero-content">
            <h1 className="lila-hero-title">Brilla con tu propia luz</h1>
            <p className="lila-hero-desc">
              Descubre nuestra nueva colección de aros, pulseras y collares
              diseñados para resaltar tu belleza única cada día.
            </p>
            <Link to="/accesorios" className="lila-btn lila-btn-primary">
              Explorar Colección
            </Link>
          </div>
          <div className="lila-hero-image">
            {productosAccesorios[0]?.imagenes?.[0] ? (
              <img
                src="./PrincipalImg.jpg"
                alt="Nueva colección Lila"
              />
            ) : (
              <img
                src="https://storage.googleapis.com/banani-generated-images/generated-images/839bf269-05eb-47b9-bfd2-7a122b67bbce.jpg"
                alt="Nueva colección Lila"
              />
            )}
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      {productosDestacados.length > 0 && (
        <section className="lila-featured">
          <div className="lila-container">
            <div className="lila-section-header">
              <h2 className="lila-section-title">Productos Destacados</h2>
              <Link to="/accesorios" className="lila-link-action">Ver todos</Link>
            </div>
            <div className="lila-product-grid">
              {productosDestacados.slice(0, 4).map(producto => {
                const imagen = producto.imagenes?.find(i => i.es_principal) || producto.imagenes?.[0];
                return (
                  <div
                    key={producto.id_producto}
                    className="lila-product-card"
                    onClick={() => handleVerDetalleProducto(producto)}
                  >
                    <div className="lila-product-img-wrap">
                      {imagen ? (
                        <img
                          className="lila-product-img"
                          src={getProductImageUrl(imagen.imagen_path) || ''}
                          alt={producto.nombre}
                        />
                      ) : (
                        <div className="lila-product-img" />
                      )}
                    </div>
                    <div className="lila-product-info">
                      <span className="lila-product-category">
                        {producto.categorias?.[0]?.nombre ?? 'Accesorio'}
                      </span>
                      <span className="lila-product-name">{producto.nombre}</span>
                      <span className="lila-product-price">
                        {producto.promocion_activa && producto.precio_promocion != null ? (
                          <>
                            <span className="lila-product-price-old">{formatPrice(producto.precioventa)}</span>
                            {formatPrice(producto.precio_promocion)}
                          </>
                        ) : (
                          formatPrice(producto.precioventa)
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Promociones */}
      <PromocionesDestacadas promociones={promociones} />

      {/* Accesorios */}
      {productosAccesorios.length > 0 && (
        <section className="lila-accessories">
          <div className="lila-container">
            <div className="lila-section-header">
              <h2 className="lila-section-title">Accesorios</h2>
              <Link to="/accesorios" className="lila-link-action">Ver todos</Link>
            </div>
            <div className="lila-product-grid">
              {productosAccesorios.map(producto => {
                const imagen = producto.imagenes?.find(i => i.es_principal) || producto.imagenes?.[0];
                return (
                  <div
                    key={producto.id_producto}
                    className="lila-product-card"
                    onClick={() => handleVerDetalleProducto(producto)}
                  >
                    <div className="lila-product-img-wrap">
                      {imagen ? (
                        <img
                          className="lila-product-img"
                          src={getProductImageUrl(imagen.imagen_path) || ''}
                          alt={producto.nombre}
                        />
                      ) : (
                        <div className="lila-product-img" />
                      )}
                    </div>
                    <div className="lila-product-info">
                      <span className="lila-product-category">
                        {producto.categorias?.[0]?.nombre ?? 'Accesorio'}
                      </span>
                      <span className="lila-product-name">{producto.nombre}</span>
                      <span className="lila-product-price">
                        {producto.promocion_activa && producto.precio_promocion != null ? (
                          <>
                            <span className="lila-product-price-old">{formatPrice(producto.precioventa)}</span>
                            {formatPrice(producto.precio_promocion)}
                          </>
                        ) : (
                          formatPrice(producto.precioventa)
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Características / Garantías */}
      <section className="lila-features">
        <div className="lila-features-grid">
          <div className="lila-feature-item">
            <div className="lila-feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" rx="2"></rect>
                <path d="M16 8h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4"></path>
                <path d="M12 17v4"></path>
                <line x1="8" y1="21" x2="16" y2="21"></line>
              </svg>
            </div>
            <h3 className="lila-feature-title">Envío Gratis</h3>
            <p className="lila-feature-desc">En compras superiores a $50</p>
          </div>
          <div className="lila-feature-item">
            <div className="lila-feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="lila-feature-title">Calidad Garantizada</h3>
            <p className="lila-feature-desc">Materiales hipoalergénicos</p>
          </div>
          <div className="lila-feature-item">
            <div className="lila-feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 12V22H4V12"></path>
                <path d="M22 7H2v5h20V7z"></path>
                <path d="M12 22V7"></path>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
              </svg>
            </div>
            <h3 className="lila-feature-title">Packaging Especial</h3>
            <p className="lila-feature-desc">Ideal para regalar</p>
          </div>
        </div>
      </section>

    </div>
  );
};