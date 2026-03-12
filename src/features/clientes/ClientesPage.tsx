import React, { useState } from 'react';
import { useClientes } from './context/ClientesContext';
import { TablaClientes } from './components/TablaClientes';
import { ModalDetalleCliente } from './components/ModalDetalleCliente';
import PageHeader from '../../shared/components/PageHeader';
import Card from '../../shared/components/Card';
import './styles/clientes.css';
import Page from '../../shared/components/Page';
import Buscador from './components/Buscador';
import CargandoPage from '../../shared/components/CargandoPage';
import { ExcelActions } from '../../shared/components/ExcelActions';
import { getClientes } from './services/clienteService';
import { ExcelColumn } from '../../shared/utils/excel';
import { Cliente } from '../../core/types';

const CLIENTES_COLUMNS: ExcelColumn<Cliente>[] = [
  { key: 'id_cliente', header: 'ID', exportOnly: true, width: 36 },
  { key: 'nombre', header: 'Nombre', width: 20 },
  { key: 'apellido', header: 'Apellido', width: 20 },
  { key: 'email', header: 'Email', width: 30 },
  { key: 'telefono', header: 'Teléfono', width: 16 },
  { key: 'direccion', header: 'Dirección', width: 30 },
  { key: 'estado', header: 'Estado', width: 10, exportOnly: true, format: v => (v ? 'Activo' : 'Inactivo') },
  { key: 'created_at', header: 'Fecha Registro', width: 22, exportOnly: true, format: v => (v ? v.split('T')[0] : '') },
];
/**
 * Página de clientes en el panel de administración.
 * Sección: 'clientes'
 */
const ClientesPage: React.FC = () => {
  const {
    clientes,
    isLoading,
    clienteSeleccionado,
    modalDetalle,
    handleBuscar,
    handleVerCliente,
    handleToggleEstado,
  } = useClientes();

  const [busqueda, setBusqueda] = useState('');


  const handleSetBuscar = (value: string) => {
    setBusqueda(value);
  }

  const handleBuscarClientes = (value?: string) => {
    const query = value ?? busqueda;
    handleBuscar(query);
  };

  if (isLoading) {
    return (
      <CargandoPage mensaje="clientes" />
    );
  }

  return (
    <Page>
      <PageHeader title="Clientes" subtitle='Gestion de clientes de la empresa' />

      <ExcelActions<Cliente>
        data={clientes}
        columns={CLIENTES_COLUMNS}
        sheetName="Clientes"
        fileName="clientes"
        onFetchAll={getClientes}
        disableImport
      />
      
      <div className="clientes-content">
        <Buscador
          busqueda={busqueda}
          handleSetBuscar={handleSetBuscar}
          handleBuscar={handleBuscarClientes}
        />

        <Card>
          {/* Buscador */}

          <TablaClientes
            clientes={clientes}
            onVerDetalle={handleVerCliente}
            onToggleEstado={handleToggleEstado}
          />
        </Card>
      </div>

      <ModalDetalleCliente
        isOpen={modalDetalle.isOpen}
        cliente={clienteSeleccionado}
        onClose={modalDetalle.close}
        onToggleEstado={handleToggleEstado}
      />
    </Page>
  );
};

export default ClientesPage;
