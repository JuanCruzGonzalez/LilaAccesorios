import { Categoria } from "../../../core/types";

export default function Estadisticas({ categorias, categoriasActivas }: { categorias: Categoria[]; categoriasActivas: Categoria[] }) {
    return (

        <div className="stats-grid">
            <div className="stat-card-minimal">
                <div className="stat-label">Categorías Activas</div>
                <div className="stat-value">{categoriasActivas.length}</div>
            </div>
            <div className="stat-card-minimal">
                <div className="stat-label">Total de Categorías</div>
                <div className="stat-value">{categorias.length}</div>
            </div>
        </div>
    )
}