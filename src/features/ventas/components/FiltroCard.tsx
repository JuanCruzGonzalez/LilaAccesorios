export default function FiltroCard({ title, value, handle }: { title: string; value: string; handle: (value: string) => void }) {
    return (
        <div className="filter-column">
            <label>{title}</label>
            <input className='inputFlilter' type="date" value={value} onChange={(e) => handle(e.target.value)} />
        </div>
    )
}