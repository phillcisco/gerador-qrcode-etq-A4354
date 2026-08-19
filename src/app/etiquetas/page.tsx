

export default function EtiquetasPage() {
  return (
    <main>
        <h1>Gerador de Etiquetas</h1>

        <form action="/api/etiquetas" method="GET">

            <label htmlFor="etq">Etiqueta</label>

            <input type="number" name="etq" id="etq" min="1" max="22" defaultValue="1"/>

            <button>Gerar PDF</button>

        </form>
    </main>
  )
}

