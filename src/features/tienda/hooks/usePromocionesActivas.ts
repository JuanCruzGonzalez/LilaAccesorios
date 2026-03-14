import { useState, useEffect } from 'react';
import { Promocion } from '../../../core/types';
import { getPromocionesActivas } from '../../promociones/services/promocionService';

export function usePromocionesActivas() {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const cargar = async () => {
      try {
        setLoading(true);
        const data = await getPromocionesActivas();
        if (!cancelled) setPromociones(data);
      } catch (error) {
        console.error('Error al cargar promociones activas:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    cargar();
    return () => { cancelled = true; };
  }, []);

  return { promociones, loading };
}
