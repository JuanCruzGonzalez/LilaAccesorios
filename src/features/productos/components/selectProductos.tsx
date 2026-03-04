export default function SelectProductos({statusFilter, handlerStatusFilterChange}: {statusFilter: 'all' | 'active' | 'inactive', handlerStatusFilterChange: (value: 'all' | 'active' | 'inactive') => void}) {
    return (
        <select value={statusFilter} onChange={(e) => handlerStatusFilterChange(e.target.value as any)} style={{ padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px', color: '#333' }}>
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
        </select>
    )
}