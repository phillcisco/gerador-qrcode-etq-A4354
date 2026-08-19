import { gerarEtiquetas } from "@/libs/gerarEtiquetas";

export async function GET(request: Request){

    const { searchParams } = new URL(request.url);

    const etq = Number(searchParams.get("etq"));

    const pdfEmBytes = await gerarEtiquetas(etq);

    const body = new Uint8Array(pdfEmBytes).buffer;

    return new Response(body, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline; filename=etiquetas.pdf",
        },
    });
}