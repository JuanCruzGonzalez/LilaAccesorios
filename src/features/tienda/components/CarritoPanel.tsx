import React from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useClienteAuth } from '../context/ClienteAuthContext';
import { formatPrice } from '../../../shared/utils';
import '../styles/carrito-panel.css';
import { getProductImageUrl } from '../../../shared/services/storageService';

export const CarritoPanel: React.FC = () => {
  const {
    carrito,
    mostrarCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    calcularTotal,
    enviarPedidoWhatsApp,
    cerrarCarrito,
  } = useCarrito();
  const { isAuthenticated, isLoading: authLoading } = useClienteAuth();

  if (!mostrarCarrito) return null;

  const subtotal = calcularTotal;
  const envio = 'A calcular';

  return (
    <div className="cart-overlay">
      <div className="overlay-space" onClick={cerrarCarrito} />
      <aside className="cart-drawer">
        <div className="drawer-header">
          <div className="drawer-title-block">
            <h1 className="drawer-title">Mi Carrito</h1>
            <div className="drawer-subtitle">
              {carrito.length} {carrito.length === 1 ? 'producto' : 'productos'}
            </div>
          </div>
          <button onClick={cerrarCarrito} className="close-btn" aria-label="Cerrar carrito">
            x
          </button>
        </div>

        <div className="drawer-content">
          {carrito.length === 0 ? (
            <div className="cart-empty">
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {carrito.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={getProductImageUrl(item.imagenes?.[0]?.imagen_path || null) || 'path/to/default/image.jpg'} alt={item.nombre} className="item-image" />
                    <div className="item-info">
                      <div className="item-top">
                        <div className="item-name-block">
                          <h2 className="item-name">{item.nombre}</h2>
                          <div className="item-meta">En stock</div>
                        </div>
                        <button
                          onClick={() => eliminarDelCarrito(item.id)}
                          className="remove-btn"
                          aria-label="Eliminar producto"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                      <div className="item-actions">
                        <div className="qty-control">
                          <button
                            onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                            className="qty-btn"
                            disabled={item.cantidad <= 1}
                            aria-label="Disminuir cantidad"
                          >
                            -
                          </button>
                          <div className="qty-value">{item.cantidad}</div>
                          <button
                            onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                            className="qty-btn"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                        <div className="item-price">{formatPrice(item.precio * item.cantidad)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="drawer-footer">
                <div className="summary-card">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Envío</span>
                    <span>{envio}</span>
                  </div>
                  <div className="summary-row summary-total">
                    <span>Total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <div className="shipping-note">
                  Finalizá tu compra para ver medios de pago y costo de envío.
                </div>

                <button onClick={vaciarCarrito} className="clear-cart-btn">
                  Vaciar carrito
                </button>

                {!authLoading && !isAuthenticated ? (
                  <div className="auth-notice">
                    <p className="auth-notice-text">
                      Debes iniciar sesión para finalizar tu compra
                    </p>
                    <Link
                      to="/login-cliente"
                      onClick={cerrarCarrito}
                      className="auth-notice-btn"
                    >
                      Iniciar sesión
                    </Link>
                    <br />
                    <Link
                      to="/registro"
                      onClick={cerrarCarrito}
                      className="auth-notice-link"
                    >
                      ¿No tenés cuenta? Registrate
                    </Link>
                  </div>
                ) : (
                  <button onClick={enviarPedidoWhatsApp} className="checkout-btn">
                    <span>Hacer pedido por WhatsApp</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </button>
                )}

                <button onClick={cerrarCarrito} className="continue-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Seguir comprando
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
};
