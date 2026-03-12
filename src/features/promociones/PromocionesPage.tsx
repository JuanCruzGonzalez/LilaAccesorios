import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../lib/queryClient';
import { usePromociones } from './context/PromocionesContext';
import { ModalCrearPromocion } from './components/ModalCrearPromocion';
import ModalVerPromocion from './components/ModalVerPromocion';
import { getProductosActivos } from '../productos/services/productoService';
import { useToast } from '../../shared/hooks/useToast';
import Page from '../../shared/components/Page';
import Card from '../../shared/components/Card';
import H1 from '../../shared/components/H1';
import TablaPromociones from './components/TablaPromociones';
import { ExcelActions } from '../../shared/components/ExcelActions';
import { ExcelColumn } from '../../shared/utils/excel';
import { bulkCreatePromociones, getPromociones } from './services/promocionService';
import { Promocion } from '../../core/types';

const PROMOCIONES_COLUMNS: ExcelColumn<Promocion>[] = [
    { key: 'id_promocion', header: 'ID', exportOnly: true, width: 8 },
    { key: 'name', header: 'Nombre', width: 30 },
    { key: 'precio', header: 'Precio', width: 14, parseImport: v => (v != null && v !== '' ? Number(v) : null) },
    { key: 'estado', header: 'Estado', width: 10, format: v => (v ? 'Activo' : 'Inactivo'), parseImport: v => String(v).toLowerCase() === 'activo' || v === true || v === 1 },
];

export const PromocionesPage: React.FC = () => {
    const {
        modalCrearPromocion,
        promociones,
        recargarPromociones,
    } = usePromociones();

    const { showWarning, showSuccess, showError } = useToast();

    const { data: productosActivos = [] } = useQuery({
        queryKey: queryKeys.productosActivos,
        queryFn: getProductosActivos,
        staleTime: 1000 * 60 * 5,
    });
    return (
        <Page>
            <div className="page-header">
                <div>
                    <H1 texto="Promociones" />
                    <p className="page-subtitle">Crea y administra promociones</p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <button className="btn-primary" onClick={modalCrearPromocion.open}>+ Nueva Promoción</button>
                </div>
            </div>
            <ExcelActions<Promocion>
                data={promociones}
                columns={PROMOCIONES_COLUMNS}
                sheetName="Promociones"
                fileName="promociones"
                onFetchAll={getPromociones}
                onImport={async rows => {
                    try {
                        const n = await bulkCreatePromociones(rows);
                        showSuccess(`${n} promoción(es) importada(s). Podés editarlas para agregar productos.`);
                        await recargarPromociones();
                    } catch {
                        showError('Error al importar promociones');
                    }
                }}
            />

            <Card>
                <TablaPromociones />
            </Card>

            {/* Modales */}
            <ModalCrearPromocion
                productos={productosActivos}
                showWarning={showWarning}
            />
            <ModalVerPromocion
                productosCatalogo={productosActivos}
            />
        </Page>
    );
};

export default PromocionesPage;
