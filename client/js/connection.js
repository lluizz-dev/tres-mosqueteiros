import { renderizarTabuleiro, definirCallbackClique, marcarSelecionada, destacarMovimentosValidos, limparDestaques } from "./board.js";
import { calcularMovimentosValidos } from "./rulesPreview.js";

let socket = null;
let meuPapel = null;
let turnoAtual = null;
let origemSelecionada = null;
let tabuleiroAtual = null;

const URL_SERVIDOR = "ws://localhost:3000";

export function iniciarConexao() {
    socket = new WebSocket(URL_SERVIDOR);

    socket.addEventListener("open", () => {
        socket.send(JSON.stringify({ tipo: "entrar" }));
    });

    socket.addEventListener("message", (evento) => {
        tratarMensagemServidor(JSON.parse(evento.data));
    });

    socket.addEventListener("close", () => {
        exibirMensagem("Conexão encerrada.");
    });

    definirCallbackClique(selecionarCasa);
    exibirMensagem("Aguardando o outro jogador...");
}

function tratarMensagemServidor(mensagem) {
    switch (mensagem.tipo) {
        case "aguardando":
            exibirMensagem("Aguardando o outro jogador...");
            break;
        case "inicio":
            meuPapel = mensagem.papel;
            turnoAtual = mensagem.turno;
            tabuleiroAtual = mensagem.tabuleiro;
            renderizarTabuleiro(mensagem.tabuleiro);
            atualizarTurno();
            break;
        case "estado":
            turnoAtual = mensagem.turno;
            tabuleiroAtual = mensagem.tabuleiro;
            renderizarTabuleiro(mensagem.tabuleiro);
            atualizarTurno();
            break;
        case "jogadaInvalida":
            exibirMensagem(`Jogada inválida: ${mensagem.motivo}`);
            break;
        case "fimDeJogo":
            tratarFimDeJogo(mensagem.resultado);
            break;
        case "erro":
            exibirMensagem(mensagem.motivo);
            break;
    }
}

function atualizarTurno() {
    const ehMinhaVez = turnoAtual === meuPapel;
    exibirMensagem(ehMinhaVez ? `Sua vez de jogar (${meuPapel}).` : "Aguardando o outro jogador jogar.");
    document.getElementById("tabuleiro").classList.toggle("bloqueado", !ehMinhaVez);
}

function selecionarCasa(linha, coluna) {
    if (turnoAtual !== meuPapel) return;

    if (origemSelecionada === null) {
        const valor = tabuleiroAtual[linha][coluna];
        const ehMinhaPeca = (meuPapel === "Mosqueteiro" && valor === 1) || (meuPapel === "Guarda" && valor === 2);
        if (!ehMinhaPeca) return;

        origemSelecionada = { linha, coluna };
        marcarSelecionada(linha, coluna);
        const movimentos = calcularMovimentosValidos(tabuleiroAtual, linha, coluna);
        destacarMovimentosValidos(movimentos);
        return;
    }

    socket.send(JSON.stringify({
        tipo: "jogada",
        jogada: { posicaoOrigem: origemSelecionada, posicaoDestino: { linha, coluna } }
    }));

    origemSelecionada = null;
    limparDestaques();
}

function tratarFimDeJogo(resultado) {
    let texto = "";
    if (resultado === "MosqueteirosVencem") {
        texto = meuPapel === "Mosqueteiro" ? "Você venceu!" : "Você perdeu. Mosqueteiros venceram.";
    } else if (resultado === "GuardasVencem") {
        texto = meuPapel === "Guarda" ? "Você venceu!" : "Você perdeu. Guardas venceram.";
    }
    exibirMensagem(texto);
    document.getElementById("tabuleiro").classList.add("bloqueado");
}

function exibirMensagem(texto) {
    document.getElementById("mensagem").textContent = texto;
}