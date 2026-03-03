export default function H1({ texto }: { texto: string }) {
    return (
        <h1 className="page-title">
            {texto}
        </h1>
    );
}