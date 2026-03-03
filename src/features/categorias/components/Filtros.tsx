export default function Filtros({ filtroEstado, handleFiltroChange }: { filtroEstado: 'all' | 'activo' | 'inactivo'; handleFiltroChange: (value: 'all' | 'activo' | 'inactivo') => void }) {
    return (
        <div className='filtros'>
            <div className='filtro'>
                <select
                    value={filtroEstado}
                    onChange={(e) => handleFiltroChange(e.target.value as 'all' | 'activo' | 'inactivo')}
                    style={{ padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px', color: '#333' }}
                >
                    <option value="all">Todos</option>
                    <option value="activo">Activas</option>
                    <option value="inactivo">Inactivas</option>
                </select>
            </div>
        </div>
    )
}