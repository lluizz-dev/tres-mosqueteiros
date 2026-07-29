const VAZIO = 0;
const MOSQUETEIRO = 1;
const GUARDA = 2;

const DIRECOES = [
    { dLinha: -1, dColuna: 0 },
    { dLinha: 1, dColuna: 0 },
    { dLinha: 0, dColuna: 1 },
    { dLinha: 0, dColuna: -1 },
];

function posicaoValida(linha, coluna) {
    return linha >= 0 && linha <= 4 && coluna >= 0 && coluna <= 4;
}

export function calcularMovimentosValidos(tabuleiro, linhaOrigem, colunaOrigem) {
    const movimentos = [];
    const peca = tabuleiro[linhaOrigem][colunaOrigem];
    if (peca === VAZIO) return movimentos;

    for (const dir of DIRECOES) {
        const linhaViz = linhaOrigem + dir.dLinha;
        const colunaViz = colunaOrigem + dir.dColuna;
        if (!posicaoValida(linhaViz, colunaViz)) continue;

        const pecaViz = tabuleiro[linhaViz][colunaViz];

        if (peca === MOSQUETEIRO && pecaViz === GUARDA) {
            movimentos.push({ linha: linhaViz, coluna: colunaViz });
        }

        if (peca === GUARDA && pecaViz === VAZIO) {
            movimentos.push({ linha: linhaViz, coluna: colunaViz });
        }
    }

    return movimentos;
}