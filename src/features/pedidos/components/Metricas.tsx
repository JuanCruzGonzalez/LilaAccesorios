import { formatPrice } from "../../../shared/utils";

export default function Metricas({ contadorPendientes, metricasHoy }: { contadorPendientes: number; metricasHoy: any }) {
    return (
        <div className="stats-grid">
            <div className="stat-card-minimal">
                <div className="stat-label">Pedidos Pendientes</div>
                <div className="stat-value stat-warning">{contadorPendientes}</div>
            </div>
            <div className="stat-card-minimal">
                <div className="stat-label">Pedidos Hoy</div>
                <div className="stat-value">{metricasHoy.total}</div>
            </div>
            <div className="stat-card-minimal">
                <div className="stat-label">Entregados Hoy</div>
                <div className="stat-value stat-success">{metricasHoy.entregados}</div>
            </div>
            <div className="stat-card-minimal">
                <div className="stat-label">Ventas Hoy</div>
                <div className="stat-value">{formatPrice(metricasHoy.totalVentas)}</div>
            </div>
        </div>
    )
}