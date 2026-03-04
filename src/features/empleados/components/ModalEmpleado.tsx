import { Empleado } from "../../../core/types";
import Modal from "../../../shared/components/Modal";

export default function ModalEmpleado({ modalView, handleEstadoModalView }: { modalView: { open: boolean; empleado?: Empleado };  handleEstadoModalView: (empleado: Empleado, open: boolean) => void;}) {
    if (!modalView.open) return null;
    return (
        <Modal close={() => handleEstadoModalView(modalView.empleado!, false)} title="Información del Empleado">
                <div className="modal-body modalEmpleadoDetalleBody">
                    <table className="empleadoDetalleTable">
                        <tbody>
                            <tr key="nombre">
                                <td className="empleadoDetalleLabel">Nombre</td>
                                <td className="empleadoDetalleValue">{modalView.empleado?.nombre || '-'}</td>
                            </tr>
                            <tr key="apellido">
                                <td className="empleadoDetalleLabel">Apellido</td>
                                <td className="empleadoDetalleValue">{modalView.empleado?.apellido || '-'}</td>
                            </tr>
                            <tr key="email">
                                <td className="empleadoDetalleLabel">Email</td>
                                <td className="empleadoDetalleValue">{modalView.empleado?.email || '-'}</td>
                            </tr>
                            <tr key="fecha_nacimiento">
                                <td className="empleadoDetalleLabel">Fecha de nacimiento</td>
                                <td className="empleadoDetalleValue">
                                    {modalView.empleado?.fecha_nacimiento
                                        ? new Date(modalView.empleado.fecha_nacimiento).toLocaleDateString()
                                        : '-'}
                                </td>
                            </tr>
                            <tr key="dni">
                                <td className="empleadoDetalleLabel">DNI</td>
                                <td className="empleadoDetalleValue">{modalView.empleado?.dni || '-'}</td>
                            </tr>
                            <tr key="estado">
                                <td className="empleadoDetalleLabel">Estado</td>
                                <td className="empleadoDetalleValue">{modalView.empleado?.estado || '-'}</td>
                            </tr>
                            <tr key="fecha_alta">
                                <td className="empleadoDetalleLabel">Fecha de alta</td>
                                <td className="empleadoDetalleValue">
                                    {modalView.empleado?.created_at
                                        ? new Date(modalView.empleado.created_at).toLocaleString()
                                        : '-'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="empleadoDetalleFooter">
                        <button onClick={() => handleEstadoModalView(modalView.empleado!, false)}>Cerrar</button>
                    </div>
                </div>
            </Modal>
    )
}