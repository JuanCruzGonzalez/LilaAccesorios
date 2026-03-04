export default function Modal({ children, close, title }: { children: React.ReactNode, close: () => void, title: string }) {
    return (
        <div className="modal-overlay" onClick={close}>
            <div className="modal-minimal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-minimal-header">
                    <h2>{title}</h2>
                    <button className="btn-close" onClick={close}>×</button>
                </div>
                {children}
            </div>
        </div>
    )
}