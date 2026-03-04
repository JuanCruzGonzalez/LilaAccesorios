import FiltroCard from "./FiltroCard";

export default function Filtros({ desde, hasta, estadoFilter, handleBuscarVentas, handleSetDesde, handleSetHasta, handleSetEstadoFilter }: {desde: string; hasta: string; estadoFilter: string; handleBuscarVentas: (opts: { desde?: string; hasta?: string; estado?: boolean; baja?: boolean }) => void; handleSetDesde: (value: string) => void; handleSetHasta: (value: string) => void; handleSetEstadoFilter: (value: 'all' | 'pagada' | 'pendiente' | 'baja') => void}) {
    const doSearch = () => {
        const opts: { desde?: string; hasta?: string; estado?: boolean; baja?: boolean } = {};
        if (desde) opts.desde = desde;
        if (hasta) opts.hasta = hasta;
        if (estadoFilter === 'pagada') opts.estado = true;
        if (estadoFilter === 'pendiente') opts.estado = false;
        if (estadoFilter === 'baja') opts.baja = true;
        else opts.baja = false;
        handleBuscarVentas(opts);
    };

    const resetFilters = () => {
        handleSetDesde('');
        handleSetHasta('');
        handleSetEstadoFilter('all');
        handleBuscarVentas({ baja: false });
    };
    return (
        <div className="stats-grid ventas-filters">
            <div className="ventas-filters-row">
                <FiltroCard title="Fecha desde" value={desde} handle={handleSetDesde} />
                <FiltroCard title="Fecha hasta" value={hasta} handle={handleSetHasta} />
                <div className="filter-column">
                    <label>Estado</label>
                    <select className='inputFlilter' value={estadoFilter} onChange={(e) => handleSetEstadoFilter(e.target.value as any)}>
                        <option value="all">Todos</option>
                        <option value="pagada">Pagadas</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="baja">Dadas de baja</option>
                    </select>
                </div>

                <div className="filter-actions">
                    <button className="btn-secondary" onClick={doSearch}>Buscar</button>
                    <button className="btn-link" onClick={resetFilters}>Limpiar</button>
                </div>
            </div>
        </div>
    )
}