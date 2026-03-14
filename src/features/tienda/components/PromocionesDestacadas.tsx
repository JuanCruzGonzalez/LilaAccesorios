import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Promocion } from '../../../core/types';
import { getPromocionImageUrl } from '../../../shared/services/storageService';
import { formatPriceLocale } from '../../../shared/utils';

interface PromocionesDestacadasProps {
  promociones: Promocion[];
}

export const PromocionesDestacadas: React.FC<PromocionesDestacadasProps> = ({ promociones }) => {
  const navigate = useNavigate();

  if (promociones.length === 0) return null;

  return (
    <section className="lila-promos">
      <div className="lila-container">
        <div className="lila-section-header">
          <h2 className="lila-section-title">Promociones Especiales</h2>
          <Link to="/promociones" className="lila-link-action">Ver todas</Link>
        </div>
        <div className="lila-promo-grid">
          {promociones.slice(0, 4).map(promo => (
            <div
              key={promo.id_promocion}
              className="lila-promo-card"
              onClick={() => navigate('/promociones')}
            >
              <div className="lila-promo-img-wrap">
                {promo.imagen_path ? (
                  <img
                    className="lila-promo-img"
                    src={getPromocionImageUrl(promo.imagen_path) || ''}
                    alt={promo.name}
                  />
                ) : (
                  <div className="lila-promo-img-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 12V22H4V12" />
                      <path d="M22 7H2v5h20V7z" />
                      <path d="M12 22V7" />
                      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                    </svg>
                  </div>
                )}
                <span className="lila-promo-badge">Promo</span>
              </div>
              <div className="lila-promo-info">
                <span className="lila-promo-name">{promo.name}</span>
                <span className="lila-promo-price">
                  {promo.precio != null ? formatPriceLocale(promo.precio) : 'Consultar'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
