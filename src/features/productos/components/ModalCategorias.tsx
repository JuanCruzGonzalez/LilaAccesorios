import { Categoria } from "../../../core/types";
import Modal from "../../../shared/components/Modal";

export default function ModalCategorias({ categorias, categoriasSeleccionadas, setCategoriasSeleccionadas, setModalCategoriasOpen }: { categorias: Categoria[]; categoriasSeleccionadas: number[]; setCategoriasSeleccionadas: (ids: number[]) => void; setModalCategoriasOpen: (open: boolean) => void }) {
    return (
            <Modal close={() => setModalCategoriasOpen(false)} title="Seleccionar Categorías">
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                    {categorias.filter(c => c.estado).length === 0 ? (
                        <p style={{ margin: 0, color: '#999', fontSize: '14px', textAlign: 'center' }}>No hay categorías disponibles</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {categorias.filter(c => c.estado).map(categoria => (
                                <label
                                    key={categoria.id_categoria}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        backgroundColor: categoriasSeleccionadas.includes(categoria.id_categoria) ? '#f0f9ff' : '#fff',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!categoriasSeleccionadas.includes(categoria.id_categoria)) {
                                            e.currentTarget.style.backgroundColor = '#f9fafb';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!categoriasSeleccionadas.includes(categoria.id_categoria)) {
                                            e.currentTarget.style.backgroundColor = '#fff';
                                        }
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={categoriasSeleccionadas.includes(categoria.id_categoria)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setCategoriasSeleccionadas([...categoriasSeleccionadas, categoria.id_categoria]);
                                            } else {
                                                setCategoriasSeleccionadas(categoriasSeleccionadas.filter(id => id !== categoria.id_categoria));
                                            }
                                        }}
                                        style={{
                                            width: '18px',
                                            height: '18px',
                                            margin: 0,
                                            cursor: 'pointer',
                                            accentColor: '#3b82f6'
                                        }}
                                    />
                                    <span style={{ flex: 1, fontWeight: categoriasSeleccionadas.includes(categoria.id_categoria) ? 600 : 400 }}>
                                        {categoria.nombre}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                <div className="modal-minimal-footer">
                    <button
                        className="btn-secondary"
                        onClick={() => setCategoriasSeleccionadas([])}
                        style={{ flex: 1 }}
                    >
                        Limpiar Todo
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => setModalCategoriasOpen(false)}
                        style={{ flex: 1 }}
                    >
                        Confirmar ({categoriasSeleccionadas.length})
                    </button>
                </div>
        </Modal>
    )
}