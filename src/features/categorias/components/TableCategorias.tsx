import { useMemo } from "react";
import { Categoria } from "../../../core/types";
import { ArbolCategorias } from "./ArbolCategorias";
import { construirArbolCategorias } from "../services/categoriaService";

export default function TableCategorias({ categoriasFiltradas, handleEditarCategoria, handleToggleCategoriaEstado }: {
    categoriasFiltradas: Categoria[];
    handleEditarCategoria: (categoria: Categoria) => void;
    handleToggleCategoriaEstado: (categoria: Categoria) => void;
}) {
    // Construir árbol de categorías
    const arbolCategorias = useMemo(() => {
        return construirArbolCategorias(categoriasFiltradas);
    }, [categoriasFiltradas]);
    return (
        <div className="table-wrapper">
            <table className="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {categoriasFiltradas.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="empty-state">
                                No hay categorías para mostrar
                            </td>
                        </tr>
                    ) : (
                        <ArbolCategorias
                            categorias={arbolCategorias}
                            onEditar={handleEditarCategoria}
                            onToggleEstado={handleToggleCategoriaEstado}
                        />
                    )}
                </tbody>
            </table>
        </div>
    )
}