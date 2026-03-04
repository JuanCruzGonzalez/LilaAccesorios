export default function Buscador({ searchTerm, setSearchTerm }: { searchTerm: string; setSearchTerm: (value: string) => void }) {
    return (
        <div style={{ position: 'relative', flex: 1 }}>
            <input
                type="text"
                name="buscador"
                id="buscador"
                placeholder="Buscar teléfonos por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '12px', width: '100%', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px', color: '#333' }}
            />
        </div>
    )
}