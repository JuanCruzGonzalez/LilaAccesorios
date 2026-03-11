import React, { useState, useEffect, useRef } from 'react';
import { Producto } from '../../../core/types';
import { getPromocionImageUrl } from '../../../shared/services/storageService';
import { usePromociones } from '../context/PromocionesContext';
import Modal from '../../../shared/components/Modal';

interface ModalCrearPromocionProps {
  productos: Producto[];
  showWarning?: (message: string) => void;
}

export const ModalCrearPromocion = React.memo<ModalCrearPromocionProps>(({ productos, showWarning }) => {
  const {
    modalCrearPromocion,
    promocionToEdit,
    setPromocionToEdit,
    handleCrearPromocion,
    crearPromocionAsync,
    editarPromocionAsync,
  } = usePromociones();

  const loading = crearPromocionAsync.loading || editarPromocionAsync.loading;
  const [name, setName] = useState('');
  const [precio, setPrecio] = useState('');
  // items: productos agregados a la promoción (incluye nombre para mostrar)
  const [items, setItems] = useState<{ id_producto: number; cantidad: number; nombre?: string }[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [showProductosDropdown, setShowProductosDropdown] = useState(false);
  const [cantidadInput, setCantidadInput] = useState('1');
  const [estado, setEstado] = useState<'1' | '2'>('1');

  const productSearchRef = useRef<HTMLDivElement>(null);

  // Estados para imagen
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!modalCrearPromocion.isOpen) {
      setName('');
      setPrecio('');
      setItems([]);
      setEstado('1');
      setImageFile(null);
      setImagePreview(null);
      setBusquedaProducto('');
      setShowProductosDropdown(false);
    } else {
      // populate when opening for edit
      if (promocionToEdit) {
        setName(promocionToEdit.name ?? '');
        setPrecio(promocionToEdit.precio != null ? String(promocionToEdit.precio) : '');
        setItems(Array.isArray(promocionToEdit.productos) ? promocionToEdit.productos.map(p => ({ id_producto: p.id_producto, cantidad: p.cantidad, nombre: productos.find(x => x.id_producto === p.id_producto)?.nombre })) : []);
        setEstado(promocionToEdit.estado ? '1' : '2');
      } else {
        // creating new
        setName('');
        setPrecio('');
        setItems([]);
        setEstado('1');
        setImageFile(null);
        setImagePreview(null);
      }
    }
  }, [modalCrearPromocion.isOpen, promocionToEdit, productos]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cerrar dropdowns cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productSearchRef.current && !productSearchRef.current.contains(event.target as Node)) {
        setShowProductosDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrar productos basado en la búsqueda
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) &&
    !items.find(it => it.id_producto === p.id_producto) // No mostrar productos ya agregados
  ).slice(0, 10); // Limitar a 10 resultados

  const seleccionarProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setBusquedaProducto(producto.nombre);
    setShowProductosDropdown(false);
  };

  // Funciones para manejo de imágenes
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showWarning?.('Por favor selecciona un archivo de imagen válido');
      e.target.value = '';
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      showWarning?.('La imagen debe ser menor a 3MB');
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      const previewPromise = new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      const preview = await previewPromise;
      setImageFile(file);
      setImagePreview(preview);
    } catch (error) {
      console.error('Error al cargar imagen:', error);
      showWarning?.('Error al cargar la imagen');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  // Función para cerrar el modal y resetear loading
  const handleCloseModal = () => {
    modalCrearPromocion.close();
    crearPromocionAsync.reset();
    editarPromocionAsync.reset();
    setPromocionToEdit(null);
    setName('');
    setPrecio('');
    setItems([]);
    setEstado('1');
    setImageFile(null);
    setImagePreview(null);
    setBusquedaProducto('');
    setShowProductosDropdown(false);
  };

  if (!modalCrearPromocion.isOpen) return null;

  const agregarItem = () => {
    if (!productoSeleccionado) {
      showWarning?.('Por favor selecciona un producto');
      return;
    }

    const cant = parseInt(cantidadInput) || 0;
    if (cant <= 0) {
      showWarning?.('Ingrese una cantidad válida');
      return;
    }

    if (items.find(i => i.id_producto === productoSeleccionado.id_producto)) {
      showWarning?.('Este producto ya está agregado');
      return;
    }

    setItems(prev => [...prev, {
      id_producto: productoSeleccionado.id_producto!,
      cantidad: cant,
      nombre: productoSeleccionado.nombre,
    }]);

    setProductoSeleccionado(null);
    setBusquedaProducto('');
    setCantidadInput('1');
  };

  const setCantidad = (id: number, cantidad: number) => {
    setItems(prev => prev.map(it => it.id_producto === id ? { ...it, cantidad } : it));
  };

  const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id_producto !== id));

  const handleSubmit = () => {
    if (!name.trim()) {
      showWarning?.('Ingrese un nombre para la promoción');
      return;
    }
    if (items.length === 0) {
      showWarning?.('Seleccione al menos un producto para la promoción');
      return;
    }

    const precioNum = precio === '' ? null : (isNaN(Number(precio)) ? null : Number(precio));

    handleCrearPromocion(
      { name: name.trim(), precio: precioNum, productos: items.map(i => ({ id_producto: i.id_producto, cantidad: i.cantidad })), estado: estado === '1' },
      imageFile
    );

    setName('');
    setPrecio('');
    setItems([]);
    setEstado('1');
    setImageFile(null);
    setImagePreview(null);
    setBusquedaProducto('');
    setShowProductosDropdown(false);
  };

  return (
    <Modal close={handleCloseModal} title={promocionToEdit ? 'Editar Promoción' : 'Crear Nueva Promoción'}>
      <div className="modal-minimal-body">
        <div className="form-group">
          <label>Nombre *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre de la promoción" />
        </div>
        <div className="form-group">
          <label>Precio (opcional)</label>
          <input type="number" value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="Precio de la promoción" />
        </div>

        <div className="form-group" style={{ position: 'relative' }} ref={productSearchRef}>
          <label>Buscar y Agregar Productos</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                value={busquedaProducto}
                onChange={(e) => {
                  setBusquedaProducto(e.target.value);
                  setShowProductosDropdown(true);
                }}
                onFocus={() => setShowProductosDropdown(true)}
                placeholder="Escribe para buscar productos..."
                style={{ width: '100%' }}
              />
              {showProductosDropdown && busquedaProducto && productosFiltrados.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  marginTop: '4px'
                }}>
                  {productosFiltrados.map(p => (
                    <div
                      key={p.id_producto}
                      onClick={() => seleccionarProducto(p)}
                      style={{
                        padding: '10px 12px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0f0f0',
                        fontSize: '14px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      <div style={{ fontWeight: 500 }}>{p.nombre}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Stock: {p.stock} | ${p.precioventa.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              type="number"
              min={1}
              value={cantidadInput}
              onChange={(e) => setCantidadInput(e.target.value)}
              placeholder="Cantidad"
              style={{ width: 100 }}
            />
            <button
              className="btn-secondary"
              onClick={agregarItem}
              disabled={loading || !productoSeleccionado}
            >
              + Agregar
            </button>
          </div>

          {items.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <h4>Productos agregados</h4>
              {items.map(it => (
                <div key={it.id_producto} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px' }}>
                  <div>
                    <span>{it.nombre ?? ('#' + it.id_producto)} × </span>
                    <input type="number" min={1} value={String(it.cantidad)} onChange={(e) => setCantidad(it.id_producto, e.target.value === '' ? 1 : parseInt(e.target.value))} style={{ width: 80 }} />
                  </div>
                  <div>
                    <button className="btn-remove" onClick={() => removeItem(it.id_producto)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Estado</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value as any)}>
            <option value="1">Activo</option>
            <option value="2">Inactivo</option>
          </select>
        </div>

        <div className="form-group">
          <label>Imagen de la Promoción</label>
          <div style={{ marginTop: '8px' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading || !!imagePreview}
              style={{ marginBottom: '12px' }}
            />
            {uploading && <p>Cargando imagen...</p>}
          </div>

          {(imagePreview || (!imagePreview && promocionToEdit?.imagen_path)) && (
            <div style={{
              display: 'inline-block',
              marginTop: '12px',
              border: '2px solid #4CAF50',
              borderRadius: '8px',
              padding: '8px',
              backgroundColor: '#fff',
              position: 'relative',
            }}>
              <img
                src={imagePreview || getPromocionImageUrl(promocionToEdit?.imagen_path ?? null) || ''}
                alt="Imagen de la promoción"
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  display: 'block',
                }}
              />
              <div style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
                <span style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  backgroundColor: '#4CAF50',
                  color: '#fff',
                  borderRadius: '4px',
                }}>Principal</span>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {!imagePreview && !promocionToEdit?.imagen_path && (
            <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
              No hay imagen cargada
            </p>
          )}
        </div>
      </div>
      <div className="modal-minimal-footer">
        <button className="btn-secondary" onClick={modalCrearPromocion.close} disabled={loading}>Cancelar</button>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? (promocionToEdit ? 'Actualizando...' : 'Guardando...') : (promocionToEdit ? 'Actualizar Promoción' : 'Crear Promoción')}</button>
      </div>

    </Modal>
  );
});

export default ModalCrearPromocion;
