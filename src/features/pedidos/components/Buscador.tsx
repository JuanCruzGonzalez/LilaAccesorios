import { EstadoPedido, PedidoConDetalles } from "../../../core/types";
import InputBuscador from "./InputBuscador";

export default function Buscador({ busqueda, handleSetBuscar, handleBuscar, filtroEstado, handlerSetPedidosFiltrados, pedidos }: { busqueda: string; handleSetBuscar: (value: string) => void; handleBuscar: () => void; filtroEstado: 'all' | EstadoPedido; handlerSetPedidosFiltrados: (value: PedidoConDetalles[]) => void; pedidos: PedidoConDetalles[] }) {
    return (
        <div className="buscador">
            <InputBuscador busqueda={busqueda} handleSetBuscar={handleSetBuscar} handleBuscar={handleBuscar} />
            <button className="btn-primary" onClick={handleBuscar}>
                Buscar
            </button>
            {busqueda && (
                <button
                    className="btn-secondary"
                    onClick={() => {
                        handleSetBuscar('');
                        handlerSetPedidosFiltrados(filtroEstado === 'all' ? pedidos : pedidos.filter(p => p.estado === filtroEstado));
                    }}
                >
                    Limpiar
                </button>
            )}
        </div>
    )
}