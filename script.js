const API_URL = "http://localhost:3000/api/moto";
const IMAGENS_URL = "http://localhost:3000";

const imagemMoto = document.getElementById("MOTOS");
const mensagem = document.getElementById("mensagem");
const instrucoes = document.getElementById("instrucoes");
const campoMarca = document.getElementById("marca");
const botaoAleatorio = document.getElementById("botaoAleatorio");
const formMoto = document.getElementById("formMoto");

function mostrarMensagem(texto) {
    mensagem.textContent = texto;
}

function mostrarMoto(dados) {
    imagemMoto.onerror = () => {
        imagemMoto.hidden = true;
        instrucoes.hidden = false;
        instrucoes.textContent =
            "Não foi possível carregar a imagem. Confira o nome do arquivo.";
        mostrarMensagem("Verifique se a imagem existe na pasta do projeto.");
    };

    imagemMoto.src = IMAGENS_URL + dados.imagem;
    imagemMoto.alt = `Moto da marca ${dados.marca}`;
    imagemMoto.hidden = false;
    instrucoes.hidden = true;

    mostrarMensagem(`Marca selecionada: ${dados.marca}`);
}

async function carregarMoto(url = API_URL) {
    mostrarMensagem("Carregando moto...");

    botaoAleatorio.disabled = true;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.erro || "Não foi possível encontrar a moto.");
        }

        mostrarMoto(dados);
    } catch (erro) {
        console.error("Erro na API:", erro);
        mostrarMensagem(
            "Não foi possível conectar à API. Verifique se o servidor está ligado."
        );
    } finally {
        botaoAleatorio.disabled = false;
    }
}

botaoAleatorio.addEventListener("click", () => {
    carregarMoto();
});

formMoto.addEventListener("submit", event => {
    event.preventDefault();

    const marca = campoMarca.value.trim();

    if (!marca) {
        mostrarMensagem("Digite Honda, BMW, Kawasaki ou Yamaha.");
        campoMarca.focus();
        return;
    }

    carregarMoto(`${API_URL}/${encodeURIComponent(marca)}`);
});
