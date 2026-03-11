import type { Venta } from '../../core/types';

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export function getNombreMes(): string {
  const now = new Date();
  return `${MESES[now.getMonth()]} ${now.getFullYear()}`;
}

export function calcTopProductos(ventas: Venta[]): Array<{ nombre: string; unidades: number; revenue: number }> {
  const map: Record<number, { nombre: string; unidades: number; revenue: number }> = {};
  for (const venta of ventas) {
    for (const d of venta.detalle_venta) {
      const id = d.producto?.id_producto;
      if (!id) continue;
      const nombre = d.producto?.nombre ?? `Producto #${id}`;
      const qty = d.cantidad || 0;
      const rev = (d.precio_unitario || 0) * qty;
      if (!map[id]) map[id] = { nombre, unidades: 0, revenue: 0 };
      map[id].unidades += qty;
      map[id].revenue += rev;
    }
  }
  return Object.values(map)
    .sort((a, b) => b.unidades - a.unidades)
    .slice(0, 5);
}

export function calcVentaTotal(venta: Venta): number {
  return venta.detalle_venta.reduce(
    (s: number, d: { precio_unitario?: number; cantidad?: number }) => s + (d.precio_unitario || 0) * (d.cantidad || 0),
    0
  );
}