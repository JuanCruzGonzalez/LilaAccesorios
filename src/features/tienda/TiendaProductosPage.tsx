import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Producto, Categoria } from '../../core/types';
import { getProductosActivos } from '../productos/services/productoService';
import { getCategoriasActivas } from '../categorias/services/categoriaService';
import { generateProductUrl } from '../../shared/utils';
import { ProductosGrid } from './components/ProductosGrid';
import { useCarrito } from './context/CarritoContext';
import { supabase } from '../../core/config/supabase';

export const TiendaProductosPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const busqueda = searchParams.get('q') || '';

  const {
    obtenerItemEnCarrito,
    actualizarCantidad,
    manejarAgregarProducto,
  } = useCarrito();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState<number[]>([]);
  const [productosCategorias, setProductosCategorias] = useState<Map<number, number[]>>(new Map());
  const [categoriasPanelOpen, setCategoriasPanelOpen] = useState(false);
  const [expandedParentIds, setExpandedParentIds] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [priceFilter, setPriceFilter] = useState(0);
  const [ordenamiento, setOrdenamiento] = useState<'none' | 'price-asc' | 'price-desc' | 'ofertas'>('none');
  const [soloOfertas, setSoloOfertas] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 15;

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await getProductosActivos();
      // Solo accesorios
      const accesorios = data.filter(p => p.accesorio === true);
      setProductos(accesorios);

      if (accesorios.length > 0) {
        const max = Math.max(...accesorios.map(p =>
          p.promocion_activa && p.precio_promocion != null ? p.precio_promocion : p.precioventa
        ));
        setMaxPrice(Math.ceil(max));
        setPriceFilter(Math.ceil(max));
      }

      const categs = await getCategoriasActivas();
      setCategorias(categs);

      const { data: relaciones, error } = await supabase
        .from('categoria_producto')
        .select('id_producto, id_categoria');

      if (!error && relaciones) {
        const mapa = new Map<number, number[]>();
        relaciones.forEach((rel: any) => {
          if (!mapa.has(rel.id_producto)) {
            mapa.set(rel.id_producto, []);
          }
          mapa.get(rel.id_producto)!.push(rel.id_categoria);
        });
        setProductosCategorias(mapa);
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoriasRaiz = useMemo(
    () => categorias.filter(c => !c.id_categoria_padre),
    [categorias]
  );

  const getHijosDeCategoria = (padreId: number) =>
    categorias.filter(c => c.id_categoria_padre === padreId);

  const productosFiltrados = useMemo(() => {
    let result = productos.filter(p =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (categoriasSeleccionadas.length > 0) {
      result = result.filter(p => {
        const categsDelProducto = productosCategorias.get(p.id_producto!) || [];
        return categsDelProducto.some(catId => categoriasSeleccionadas.includes(catId));
      });
    }

    if (priceFilter < maxPrice) {
      result = result.filter(p => {
        const precio = p.promocion_activa && p.precio_promocion != null
          ? p.precio_promocion
          : p.precioventa;
        return precio <= priceFilter;
      });
    }

    if (soloOfertas) {
      result = result.filter(p => p.promocion_activa && p.precio_promocion != null);
    }

    if (ordenamiento === 'price-asc') {
      result = [...result].sort((a, b) => {
        const pa = a.promocion_activa && a.precio_promocion != null ? a.precio_promocion : a.precioventa;
        const pb = b.promocion_activa && b.precio_promocion != null ? b.precio_promocion : b.precioventa;
        return pa - pb;
      });
    } else if (ordenamiento === 'price-desc') {
      result = [...result].sort((a, b) => {
        const pa = a.promocion_activa && a.precio_promocion != null ? a.precio_promocion : a.precioventa;
        const pb = b.promocion_activa && b.precio_promocion != null ? b.precio_promocion : b.precioventa;
        return pb - pa;
      });
    } else if (ordenamiento === 'ofertas') {
      result = [...result].sort((a, b) => {
        const aPromo = a.promocion_activa && a.precio_promocion != null ? 0 : 1;
        const bPromo = b.promocion_activa && b.precio_promocion != null ? 0 : 1;
        return aPromo - bPromo;
      });
    }

    return result;
  }, [productos, busqueda, categoriasSeleccionadas, productosCategorias, priceFilter, maxPrice, soloOfertas, ordenamiento]);

  const toggleCategoria = (id: number) => {
    setCategoriasSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleExpandedParent = (id: number) => {
    setExpandedParentIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setCategoriasSeleccionadas([]);
    setPriceFilter(maxPrice);
    setSoloOfertas(false);
  };

  const activeFilterCount =
    categoriasSeleccionadas.length +
    (priceFilter < maxPrice ? 1 : 0) +
    (soloOfertas ? 1 : 0);

  // Reset to page 1 when filters/sort change
  useEffect(() => { setCurrentPage(1); }, [busqueda, categoriasSeleccionadas, priceFilter, soloOfertas, ordenamiento]);

  const totalPages = Math.ceil(productosFiltrados.length / PAGE_SIZE);
  const productosPaginados = productosFiltrados.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  const handleVerDetalleProducto = (producto: Producto) => {
    const productUrl = generateProductUrl(producto.id_producto!, producto.nombre);
    navigate(`/producto/${productUrl}`);
  };

  if (loading) {
    return (
      <div className="modern-loading">
        <div className="modern-loading-spinner"></div>
        <p className="modern-loading-text">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="modern-products-page">
      <div className="modern-products-container">
        <div className="modern-products-header">
          <div className="lila-toolbar">
            <button
              className="lila-filter-hamburger"
              onClick={() => setCategoriasPanelOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              Filtros
              {activeFilterCount > 0 && (
                <span className="lila-filter-badge">{activeFilterCount}</span>
              )}
            </button>

            <select
              className="lila-sort-select"
              value={ordenamiento}
              onChange={e => setOrdenamiento(e.target.value as typeof ordenamiento)}
            >
              <option value="none">Ordenar por</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="ofertas">Ofertas primero</option>
            </select>
          </div>
        </div>

        <ProductosGrid
          productos={productosPaginados}
          obtenerItemEnCarrito={obtenerItemEnCarrito}
          actualizarCantidad={actualizarCantidad}
          manejarAgregarProducto={manejarAgregarProducto}
          onVerDetalle={handleVerDetalleProducto}
        />

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="lila-pagination">
            <button
              className="lila-pagination-btn"
              onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={currentPage === 1}
            >‹</button>
            {getPageNumbers().map((page, i) =>
              page === 'ellipsis' ? (
                <span key={`e-${i}`} className="lila-pagination-ellipsis">…</span>
              ) : (
                <button
                  key={page}
                  className={`lila-pagination-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => { setCurrentPage(page as number); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                >{page}</button>
              )
            )}
            <button
              className="lila-pagination-btn"
              onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={currentPage === totalPages}
            >›</button>
          </div>
        )}
      </div>

      {/* Panel de filtros */}
      {categoriasPanelOpen && (
        <>
          <div className="lila-filter-overlay" onClick={() => setCategoriasPanelOpen(false)} />
          <div className="lila-filter-drawer">
            <div className="lila-filter-drawer-header">
              <h2 className="lila-filter-drawer-title">Filtros</h2>
              <button
                className="lila-filter-drawer-close"
                onClick={() => setCategoriasPanelOpen(false)}
              >✕</button>
            </div>

            <div className="lila-filter-drawer-body">
              {/* Filtro: Solo ofertas */}
              <div className="lila-filter-section">
                <label className="lila-ofertas-toggle">
                  <span className="lila-ofertas-toggle-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 12 20 22 4 22"></polyline>
                      <rect x="2" y="7" width="20" height="5"></rect>
                      <line x1="12" y1="22" x2="12" y2="7"></line>
                      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                    </svg>
                    Solo productos en oferta
                  </span>
                  <div
                    className={`lila-toggle-switch ${soloOfertas ? 'active' : ''}`}
                    onClick={() => setSoloOfertas(v => !v)}
                  >
                    <div className="lila-toggle-thumb" />
                  </div>
                </label>
              </div>

              {/* Filtro de categorías */}
              <div className="lila-filter-section">
                <h3 className="lila-filter-section-title">Categorías</h3>
                {categoriasRaiz.length === 0 && (
                  <p style={{ color: '#6b7280', padding: '8px' }}>Sin categorías disponibles</p>
                )}
                {categoriasRaiz.map(padre => {
                  const hijos = getHijosDeCategoria(padre.id_categoria);
                  const estaExpanded = expandedParentIds.includes(padre.id_categoria);
                  const tieneHijos = hijos.length > 0;
                  return (
                    <div key={padre.id_categoria} className="lila-cat-item">
                      <button
                        className={`lila-cat-padre-btn ${!tieneHijos && categoriasSeleccionadas.includes(padre.id_categoria) ? 'selected' : ''}`}
                        onClick={() =>
                          tieneHijos
                            ? toggleExpandedParent(padre.id_categoria)
                            : toggleCategoria(padre.id_categoria)
                        }
                      >
                        <span className="lila-cat-padre-nombre">{padre.nombre}</span>
                        {tieneHijos ? (
                          <svg
                            className={`lila-cat-chevron ${estaExpanded ? 'expanded' : ''}`}
                            width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            {categoriasSeleccionadas.includes(padre.id_categoria)
                              ? <polyline points="20 6 9 17 4 12" />
                              : <rect x="3" y="3" width="18" height="18" rx="3" />
                            }
                          </svg>
                        )}
                      </button>
                      {tieneHijos && estaExpanded && (
                        <div className="lila-cat-hijos">
                          {hijos.map(hijo => (
                            <label key={hijo.id_categoria} className="lila-cat-hijo-item">
                              <input
                                type="checkbox"
                                checked={categoriasSeleccionadas.includes(hijo.id_categoria)}
                                onChange={() => toggleCategoria(hijo.id_categoria)}
                                className="lila-cat-checkbox"
                              />
                              <span className="lila-cat-hijo-nombre">{hijo.nombre}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lila-filter-drawer-footer">
              <button className="lila-filter-btn-secondary" onClick={resetFilters}>
                Limpiar
              </button>
              <button className="lila-filter-btn-primary" onClick={() => setCategoriasPanelOpen(false)}>
                Aplicar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
