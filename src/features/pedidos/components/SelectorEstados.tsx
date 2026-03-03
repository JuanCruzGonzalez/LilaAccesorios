import { EstadoPedido } from "../../../core/types";

export default function SelectorEstados({ filtroEstado, handlerOnFiltroChange }: { filtroEstado: string; handlerOnFiltroChange: (value: string | EstadoPedido) => void }) {
    return (
        <select
            value={filtroEstado}
            onChange={(e) => handlerOnFiltroChange(e.target.value as string | EstadoPedido)}
            className="select-filtro"
        >
            <option value="all">Todos los estados</option>
            <option value="RECIBIDO">Recibidos</option>
            <option value="ACEPTADO">Aceptados</option>
            <option value="ENTREGADO">Entregados</option>
            <option value="CANCELADO">Cancelados</option>
        </select>
    )
}