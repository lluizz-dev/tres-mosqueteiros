import type { Posicao } from "./types.js";

export function posicaoValida(posicao: Posicao): boolean {
    if (posicao.coluna < 0 || posicao.coluna > 4) return false;
    if (posicao.linha < 0 || posicao.linha > 4) return false;

    return true;
}