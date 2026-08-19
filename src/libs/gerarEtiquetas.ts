import { PDFDocument, rgb, PDFPage } from "pdf-lib";
import QRCode from "qrcode";

//Link harcoded para todos os qrcode
const linkYoutube : string = "https://www.youtube.com/shorts/_6HzLIJPH2A";

const larguraA4 = 210;
const alturaA4 = 297;

const linhas = 11;

//Horizontal 
const margemEsquerda = 4;
const espacoHorizontal = 4;

//Vertical
const margemSuperior = 1.47;
const espacoVertical = 1.47;

//Padrão A4354 de etiquetas
const larguraEtiqueta = 99;
const alturaEtiqueta = 25.4;

const converterMMParaPts = (mm: number) => {
    return mm * 72 / 25.4;
}

//metodo interno para gerar 1 etiqueta
async function gerarEtiqueta(pdf:PDFDocument, paginaA4: PDFPage, x: number, y: number)
{
    //Desenhar uma etiqueta
    paginaA4.drawRectangle({
        x: converterMMParaPts(x),
        y: converterMMParaPts(y),
        width: converterMMParaPts(larguraEtiqueta),
        height: converterMMParaPts(alturaEtiqueta),
        //Tem que passar o rgb normalizado aqui pra lib pdf
        //Se quiser usar borda
        borderColor: rgb(0x7e / 255, 0x22 / 255,0xce / 255),
        borderWidth: 0.5
    });
    
    const qrcodePNG = await QRCode.toBuffer(
    linkYoutube,
    {
        type: "png",
        width: 300, //resolucao de 300px
        margin: 1,
    });

    const qrImage = await pdf.embedPng(qrcodePNG);

    const tamQRCode = 20;//20 mm o qrcode

    //qrcode 3 mm para a direita da etiqueta
    const qrX = x + 3;
    
    //qrcode centralizado verticalmente
    const qrY =
    y + (alturaEtiqueta - tamQRCode) / 2;

    //posiciona qrcode na etiqueta
    paginaA4.drawImage(qrImage, {
        x: converterMMParaPts(qrX),
        y: converterMMParaPts(qrY),
        width: converterMMParaPts(tamQRCode),
        height: converterMMParaPts(tamQRCode),
    });

    paginaA4.drawText(
        `Apolônia Sauro`,
        {
            x: converterMMParaPts(x + 26),
            y: converterMMParaPts(y + 11),
            size: 12,
        }
    );
}

export async function gerarEtiquetas(etq?: number){
    const pdf = await PDFDocument.create();

    const paginaA4 = await pdf.addPage([
        converterMMParaPts(larguraA4),
        converterMMParaPts(alturaA4)
    ]);

    //Se passar uma posicao de etq, gera apenas uma
    if(etq)
    {   
        const { x, y } = converterETQparaCoord(etq);
        await gerarEtiqueta(pdf,paginaA4,x,y);
    }
    else{//Caso contrario gera 22 etiquetas
        for(let etq = 1; etq <= 22; etq++){
            const {x,y} = converterETQparaCoord(etq);
            await gerarEtiqueta(pdf,paginaA4,x,y);
        }
    }

    return await pdf.save();
}

export function converterETQparaCoord(etq: number)
{
    const indice = etq - 1;

    const coluna = indice > 10 ? 1 : 0;
    const linha = indice % linhas;

    //Coordenada X da etiqueta 
    const x = margemEsquerda + coluna * (larguraEtiqueta + espacoHorizontal);

    //Coordenada Y da etiqueta.
    //A origem (0,0) fica no canto esquerda inferior. Desse
    //jeito to calculando o valor de Y para primeira etiqueta 
    //ficar no topo da página na primeira coluna.
    const y = alturaA4 -
        margemSuperior -
        (linha + 1) * alturaEtiqueta -
        linha * espacoVertical;

    return { x, y };
}