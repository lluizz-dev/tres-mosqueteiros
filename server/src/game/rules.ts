import { Peca, type Tabuleiro, type Posicao, type Jogada, type PapelJogador } from "./types.js";

export function posicaoValida(posicao: Posicao): boolean {
    if (posicao.coluna < 0 || posicao.coluna > 4) return false;
    if (posicao.linha < 0 || posicao.linha > 4) return false;
    return true;
}

const DIRECOES = [
    { dLinha: -1, dColuna: 0 }, // cima
    { dLinha: 1, dColuna: 0 },  // baixo
    { dLinha: 0, dColuna: 1 },  // direita
    { dLinha: 0, dColuna: -1 }, // esquerda
];

// Mosqueteiro: retorna posições dos guardas adjacentes (destino da captura é a própria casa do guarda)
// Guarda: retorna posições vazias adjacentes
export function calcularMovimentosValidos(tabuleiro: Tabuleiro, origem: Posicao): Posicao[] {
    const movimentos: Posicao[] = [];

    if (!posicaoValida(origem)) return movimentos;

    const peca = tabuleiro[origem.linha]![origem.coluna];
    if (peca === Peca.Vazio) return movimentos;

    for (const dir of DIRECOES) {
        const vizinho: Posicao = { linha: origem.linha + dir.dLinha, coluna: origem.coluna + dir.dColuna };
        if (!posicaoValida(vizinho)) continue;

        const pecaVizinho = tabuleiro[vizinho.linha]![vizinho.coluna];

        if (peca === Peca.Mosqueteiro && pecaVizinho === Peca.Guarda) {
            movimentos.push(vizinho);
        }

        if (peca === Peca.Guarda && pecaVizinho === Peca.Vazio) {
            movimentos.push(vizinho);
        }
    }

    return movimentos;
}

export function movimentoEhValido(tabuleiro: Tabuleiro, jogada: Jogada, papel: PapelJogador): boolean {
    const { posicaoOrigem, posicaoDestino } = jogada;

    if (!posicaoValida(posicaoOrigem) || !posicaoValida(posicaoDestino)) return false;

    const peca = tabuleiro[posicaoOrigem.linha]![posicaoOrigem.coluna];
    if (peca === Peca.Vazio) return false;
    if (papel === "Mosqueteiro" && peca !== Peca.Mosqueteiro) return false;
    if (papel === "Guarda" && peca !== Peca.Guarda) return false;

    const movimentosValidos = calcularMovimentosValidos(tabuleiro, posicaoOrigem);
    return movimentosValidos.some(m => m.linha === posicaoDestino.linha && m.coluna === posicaoDestino.coluna);
}

export function aplicarJogada(tabuleiro: Tabuleiro, jogada: Jogada): Tabuleiro {
    const novoTabuleiro = tabuleiro.map(linha => [...linha]);
    const { posicaoOrigem, posicaoDestino } = jogada;
    const peca = novoTabuleiro[posicaoOrigem.linha]![posicaoOrigem.coluna]!;

    // Tanto para captura (mosqueteiro ocupa a casa do guarda)
    // quanto para movimento simples (guarda ocupa casa vazia),
    // a peça se move de origem pra destino e a origem vira vazio.
    novoTabuleiro[posicaoOrigem.linha]![posicaoOrigem.coluna] = Peca.Vazio;
    novoTabuleiro[posicaoDestino.linha]![posicaoDestino.coluna] = peca;

    return novoTabuleiro;
}

function obterPosicoes(tabuleiro: Tabuleiro, peca: Peca): Posicao[] {
    const posicoes: Posicao[] = [];
    for (let linha = 0; linha < tabuleiro.length; linha++) {
        for (let coluna = 0; coluna < tabuleiro[linha]!.length; coluna++) {
            if (tabuleiro[linha]![coluna] === peca) posicoes.push({ linha, coluna });
        }
    }
    return posicoes;
}

function mosqueteirosMesmaLinhaOuColuna(tabuleiro: Tabuleiro): boolean {
    const posicoes = obterPosicoes(tabuleiro, Peca.Mosqueteiro);
    if (posicoes.length < 3) return false;

    const mesmaLinha = posicoes.every(p => p.linha === posicoes[0]!.linha);
    const mesmaColuna = posicoes.every(p => p.coluna === posicoes[0]!.coluna);

    return mesmaLinha || mesmaColuna;
}

function existeGuardaAdjacenteAMosqueteiro(tabuleiro: Tabuleiro): boolean {
    const mosqueteiros = obterPosicoes(tabuleiro, Peca.Mosqueteiro);

    return mosqueteiros.some(pos =>
        DIRECOES.some(dir => {
            const vizinho: Posicao = { linha: pos.linha + dir.dLinha, coluna: pos.coluna + dir.dColuna };
            if (!posicaoValida(vizinho)) return false;
            return tabuleiro[vizinho.linha]![vizinho.coluna] === Peca.Guarda;
        })
    );
}

export type ResultadoJogo = "MosqueteirosVencem" | "GuardasVencem" | "EmAndamento";

export function verificarFimDeJogo(tabuleiro: Tabuleiro, proximoTurno: PapelJogador): ResultadoJogo {
    if (mosqueteirosMesmaLinhaOuColuna(tabuleiro)) return "GuardasVencem";

    if (proximoTurno === "Mosqueteiro" && !existeGuardaAdjacenteAMosqueteiro(tabuleiro)) {
        return "MosqueteirosVencem";
    }

    return "EmAndamento";
}