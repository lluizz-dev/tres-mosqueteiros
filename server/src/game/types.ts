export enum Peca {
    Vazio,        // 0
    Mosqueteiro,  // 1
    Guarda        // 2
}

export type Tabuleiro = Peca[][];

export type Posicao = {
    linha: number;
    coluna: number;
};

export type Jogada = {
    posicaoOrigem: Posicao;
    posicaoDestino: Posicao;
}

export type PapelJogador = "Mosqueteiro" | "Guarda";