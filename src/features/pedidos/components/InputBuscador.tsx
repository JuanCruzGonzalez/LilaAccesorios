export default function InputBuscador({ busqueda, handleSetBuscar, handleBuscar }: { busqueda: string; handleSetBuscar: (value: string) => void; handleBuscar: () => void }) {
    return (
        <input
            type="text"
            placeholder="Buscar por #pedido, teléfono o nombre..."
            value={busqueda}
            onChange={(e) => handleSetBuscar(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
        />
    )
}