import Cropper from "react-easy-crop";
import Modal from "../../../shared/components/Modal";

export default function ModalRecorteImagen({ imageToCrop, crop, zoom, onCropChange, onZoomChange, onCropComplete, handleCropCancel, handleCropConfirm }: { imageToCrop: string; crop: { x: number; y: number }; zoom: number; onCropChange: (crop: { x: number; y: number }) => void; onZoomChange: (zoom: number) => void; onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void; handleCropCancel: () => void; handleCropConfirm: () => void }) {
    return (
        <Modal close={handleCropCancel} title="Recortar Imagen">

            <div style={{ position: 'relative', flex: 1, minHeight: 0, backgroundColor: '#000' }}>
                <Cropper
                    image={imageToCrop}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={onCropChange}
                    onZoomChange={onZoomChange}
                    onCropComplete={onCropComplete}
                />
            </div>
            <div style={{ padding: '20px', borderTop: '1px solid #ddd' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                        Zoom
                    </label>
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => onZoomChange(Number(e.target.value))}
                        style={{ width: '100%' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-secondary" onClick={handleCropCancel} style={{ flex: 1 }}>
                        Cancelar
                    </button>
                    <button className="btn-primary" onClick={handleCropConfirm} style={{ flex: 1 }}>
                        Confirmar Recorte
                    </button>
                </div>
            </div>
        </Modal>
    )
}