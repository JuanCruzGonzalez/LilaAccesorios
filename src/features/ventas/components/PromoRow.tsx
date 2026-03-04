import React from "react";

export const PromoRow = React.memo<{
    promo: { id_promocion: number; name: string; precio: number | null; cantidad: number };
    onChangeCantidad: (id_promocion: number, cantidad: number) => void;
    onChangePrecio: (id_promocion: number, precio: number | null) => void;
    onRemove: (id_promocion: number) => void;
}>(({ promo, onChangeCantidad, onChangePrecio, onRemove }) => {
    return (
        <div key={promo.id_promocion} className="item-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{promo.name}</span>
                    <span style={{ fontSize: '12px', padding: '2px 6px', backgroundColor: '#f0f0f0', borderRadius: '4px', color: '#666' }}>
                        Promoción
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="qty-controls">
                        <button type="button" className="qty-button" onClick={() => onChangeCantidad(promo.id_promocion, Math.max(1, promo.cantidad - 1))}>−</button>
                        <input
                            className="qty-input"
                            type="number"
                            min={1}
                            value={promo.cantidad}
                            onChange={(e) => {
                                const raw = e.target.value;
                                const parsed = raw === '' ? 0 : parseInt(raw, 10);
                                if (isNaN(parsed)) return;
                                onChangeCantidad(promo.id_promocion, Math.max(1, parsed));
                            }}
                            style={{ width: 60, textAlign: 'center' }}
                        />
                        <button type="button" className="qty-button" onClick={() => onChangeCantidad(promo.id_promocion, promo.cantidad + 1)}>+</button>
                    </div>
                    <span style={{ marginLeft: '10px', color: '#666' }}>
                        <input
                            type="number"
                            value={promo.precio == null ? '' : String(promo.precio)}
                            onChange={(e) => {
                                const raw = e.target.value;
                                if (raw === '') return onChangePrecio(promo.id_promocion, null);
                                const parsed = parseFloat(raw);
                                onChangePrecio(promo.id_promocion, isNaN(parsed) ? null : parsed);
                            }}
                            min="0"
                            style={{ width: '70px' }}
                        />
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontWeight: 'bold', width: '70px' }}>${((promo.precio ?? 0) * promo.cantidad).toFixed(2)}</span>
                        <button className="btn-remove" onClick={() => onRemove(promo.id_promocion)}>Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
    );
});
