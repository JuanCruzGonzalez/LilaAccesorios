import EstadisticaCard from "../../gastos/components/EstadisticaCard";

export default function EstadisticaGrid({ productosTotal, stockBajo, accesorio }: { productosTotal: number; stockBajo: number; accesorio: boolean }) {
    return (
        <div className="stats-grid">
            <EstadisticaCard title={`Total ${accesorio ? 'Accesorios' : 'Teléfonos'}`} value={productosTotal} />
            <EstadisticaCard title='Stock Bajo' value={stockBajo} />
        </div>
    )
}