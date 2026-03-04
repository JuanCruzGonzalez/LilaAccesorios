import React from "react";

export const ProductRow = React.memo<{
    item: { id_producto: number; cantidad: number; nombre: string; precioventa: number; dolares?: boolean };
    onUpdatePrice: (id_producto: number, newPrice: number) => void;
    onRemove: (id_producto: number) => void;
    onChangeCantidad: (id_producto: number, cantidad: number) => void;
}>(({ item, onUpdatePrice, onRemove, onChangeCantidad }) => {
    const esDolares = item.dolares ?? false;
    return (
        <div key={item.id_producto} className="item-row">
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, width: '100%' }}>
                    <span>{item.nombre}</span>
                    {esDolares && (
                        <span style={{ marginLeft: '8px', fontSize: '12px', padding: '2px 6px', backgroundColor: '#e3f2fd', borderRadius: '4px', color: '#1976d2', fontWeight: '500' }}>
                            USD
                        </span>
                    )}
                    <span style={{ marginLeft: 8, color: '#666', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>Precio: </span>
                        <input
                            style={{
                                width: '70px',
                                backgroundColor: 'transparent',
                                color: '#000',
                                border: '1px solid #ccc',
                                borderRadius: 4,
                                padding: '2px 6px',
                            }}
                            type="number"
                            value={String(item.precioventa)}
                            onChange={(e) => {
                                const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                onUpdatePrice(item.id_producto, val);
                            }}
                            min="0"
                        />
                        {esDolares && <span style={{ fontSize: '12px', color: '#1976d2' }}>USD</span>}
                    </span>
                </div>
                <div>
                    <div className="qty-controls">
                        <button type="button" className="qty-button" onClick={() => onChangeCantidad(item.id_producto, Math.max(1, item.cantidad - 1))}>−</button>
                        <input
                            className="qty-input"
                            type="number"
                            min={1}
                            value={item.cantidad}
                            onChange={(e) => {
                                const raw = e.target.value;
                                // allow empty temporarily, but enforce minimum 1 when applying
                                const parsed = raw === '' ? 0 : parseInt(raw, 10);
                                if (isNaN(parsed)) return;
                                onChangeCantidad(item.id_producto, Math.max(1, parsed));
                            }}
                            style={{ width: 60, textAlign: 'center' }}
                        />
                        <button type="button" className="qty-button" onClick={() => onChangeCantidad(item.id_producto, item.cantidad + 1)}>+</button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontWeight: 'bold', width: 'fit-content' }}>
                                ${(item.cantidad * item.precioventa).toFixed(2)}{esDolares ? ' USD' : ''}
                            </span>
                            <button className="btn-remove" onClick={() => onRemove(item.id_producto)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                                    <path d="M10 11v6"></path>
                                    <path d="M14 11v6"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
});