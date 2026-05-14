// declarações dos elementos usando DOM
const videoElemento = document.getElementById("video");
const botaoScanear = document.getElementById("btn-texto");
const resultado = document.getElementById("saida");
const canvas = document.getElementById("canvas");

// função assíncrona para habilitar a câmera
async function configurarCamera() {
    // tratamento de erros
    try{
        // chama a api do navegador para solicitar acesso
        const midia = await navigator.mediaDevices.getUserMedia({
            // habilita a câmera traseira
            video:{facingMode: "environment"},
            audio: false
        });
        // recebe a função midia para ser executada
        videoElemento.srcObject=midia;
        // força a reprodução do vídeo
        videoElemento.play();
    }catch(erro){
        resultado.innerText = "Erro ao acessar a câmera", erro;
    }
}
// executando a função
configurarCamera();

// função para capturar o texto da câmera
botaoScanear.onclick = async ()=>{
    // habilitando a câmera
    botaoScanear.disabled = true;
    resultado.innerText = "Fazendo a leitura do texto... aguarde";

    // define o canvas para iniciar a leitura
    const contexto = canvas.getContext("2d");

    // ajusta o tamanho do canvas para o tamanho real do vídeo
    canvas.width = videoElemento.videoWidth;
    canvas.height = videoElemento.videoHeight;

    // aplica o filtro para melhorar o OCR
    contexto.filter = 'contrast(1.2) grayscale(1)';

    //desenha o video no canvas
    contexto.drawImage(videoElemento, 0, 0, canvas.width, canvas.height);

    try{
        const {data: {text}} = await Tesseract.recognize(
            canvas,
            'por' // define o idioma
        );
        // remove os espaços em branco
        const textoFinal = text.trim();
        // estrutura condicional ternária ? if : else
        resultado.innerText = textoFinal.length > 0 ? textoFinal : "Não foi possível identificar o texto";

    }catch(erro){
        resultado.innerText = "Erro no processamento", erro
    }
    finally{
        // desabilita o botão para fazer uma nova captura
        botaoScanear.disabled = false;
    }
}