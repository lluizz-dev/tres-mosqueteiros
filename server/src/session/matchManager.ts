import type WebSocket from "ws";
import { criarTabuleiroInicial } from "../game/board.js";
import { movimentoEhValido, aplicarJogada, verificarFimDeJogo } from "../game/rules.js";
import type { Tabuleiro, Jogada, PapelJogador } from "../game/types.js";
import type { MensagemCliente, MensagemServidor } from "../protocol/messages.js";

type Jogador = { socket: WebSocket; papel: PapelJogador };

type Partida = {
    jogadores: [Jogador, Jogador];
    tabuleiro: Tabuleiro;
    turno: PapelJogador;
    finalizada: boolean;
};

let jogadorEsperando: WebSocket | null = null;
const partidas: Map<WebSocket, Partida> = new Map();

function enviar(socket: WebSocket, mensagem: MensagemServidor): void {
    socket.send(JSON.stringify(mensagem));
}

export function tratarConexao(socket: WebSocket): void {
    socket.on("message", (dados: WebSocket.RawData) => {
        let mensagem: MensagemCliente;
        try {
            mensagem = JSON.parse(dados.toString());
        } catch {
            enviar(socket, { tipo: "erro", motivo: "Mensagem em formato inválido." });
            return;
        }
        tratarMensagem(socket, mensagem);
    });

    socket.on("close", () => {
        if (jogadorEsperando === socket) jogadorEsperando = null;

        const partida = partidas.get(socket);
        if (partida) {
            const outro = partida.jogadores.find(j => j.socket !== socket);
            if (outro && outro.socket.readyState === outro.socket.OPEN) {
                enviar(outro.socket, { tipo: "erro", motivo: "O outro jogador desconectou." });
            }
            partidas.delete(partida.jogadores[0].socket);
            partidas.delete(partida.jogadores[1].socket);
        }
    });
}

function tratarMensagem(socket: WebSocket, mensagem: MensagemCliente): void {
    if (mensagem.tipo === "entrar") entrarNaFila(socket);
    if (mensagem.tipo === "jogada") processarJogada(socket, mensagem.jogada);
}

function entrarNaFila(socket: WebSocket): void {
    if (jogadorEsperando === null) {
        jogadorEsperando = socket;
        enviar(socket, { tipo: "aguardando" });
        return;
    }

    const jogador1: Jogador = { socket: jogadorEsperando, papel: "Mosqueteiro" };
    const jogador2: Jogador = { socket, papel: "Guarda" };
    jogadorEsperando = null;

    const tabuleiro = criarTabuleiroInicial();
    const turnoInicial: PapelJogador = "Mosqueteiro";

    const partida: Partida = { jogadores: [jogador1, jogador2], tabuleiro, turno: turnoInicial, finalizada: false };

    partidas.set(jogador1.socket, partida);
    partidas.set(jogador2.socket, partida);

    enviar(jogador1.socket, { tipo: "inicio", papel: "Mosqueteiro", tabuleiro, turno: turnoInicial });
    enviar(jogador2.socket, { tipo: "inicio", papel: "Guarda", tabuleiro, turno: turnoInicial });
}

function processarJogada(socket: WebSocket, jogada: Jogada): void {
    const partida = partidas.get(socket);
    if (!partida || partida.finalizada) {
        enviar(socket, { tipo: "erro", motivo: "Nenhuma partida ativa encontrada." });
        return;
    }

    const jogador = partida.jogadores.find(j => j.socket === socket)!;
    const oponente = partida.jogadores.find(j => j.socket !== socket)!;

    if (partida.turno !== jogador.papel) {
        enviar(socket, { tipo: "jogadaInvalida", motivo: "Não é a sua vez de jogar." });
        return;
    }

    if (!movimentoEhValido(partida.tabuleiro, jogada, jogador.papel)) {
        enviar(socket, { tipo: "jogadaInvalida", motivo: "Movimento inválido." });
        return;
    }

    partida.tabuleiro = aplicarJogada(partida.tabuleiro, jogada);
    partida.turno = partida.turno === "Mosqueteiro" ? "Guarda" : "Mosqueteiro";

    const resultado = verificarFimDeJogo(partida.tabuleiro, partida.turno);

    if (resultado !== "EmAndamento") {
        partida.finalizada = true;
        enviar(jogador.socket, { tipo: "fimDeJogo", resultado });
        enviar(oponente.socket, { tipo: "fimDeJogo", resultado });
        return;
    }

    enviar(jogador.socket, { tipo: "estado", tabuleiro: partida.tabuleiro, turno: partida.turno });
    enviar(oponente.socket, { tipo: "estado", tabuleiro: partida.tabuleiro, turno: partida.turno });
}