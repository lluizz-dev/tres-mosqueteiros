import type { Posicao, Tabuleiro, Peca } from "./types.js";

export function posicaoValida(posicao: Posicao): boolean {
    if (posicao.coluna < 0 || posicao.coluna > 4) return false;
    if (posicao.linha < 0 || posicao.linha > 4) return false;

    return true;
}

export function calcularMovimentosValidos(tabuleiro: Tabuleiro, origem: Posicao): Posicao[] {
    if (posicaoValida(origem)) {
        
        const peca = tabuleiro[origem.linha]![origem.coluna]; 
    }
}