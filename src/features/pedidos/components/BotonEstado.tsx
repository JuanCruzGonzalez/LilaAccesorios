export default function BotonEstado({ onClick, id_pedido, clase, icon }: { onClick: (id_pedido: number) => void; id_pedido: number; clase?: string; icon: React.ReactNode }) {
    return (
        <button
            className={`btn-sm btn-${clase || 'primary'}`}
            title="Aceptar pedido"
            onClick={() => onClick(id_pedido)}
        >
            {icon}
        </button>
    );
}