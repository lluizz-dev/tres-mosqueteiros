enum Peca {
    Vazio,        // 0
    Mosqueteiro,  // 1
    Guarda        // 2
}

type Tabuleiro = Peca[][];

type Posicao = {
    linha: number;
    coluna: number;
};

type Jogada = {
    posicaoOrigem: Posicao;
    posicaoDestino: Posicao;
}

type PapelJogador = "Mosqueteiro" | "Guarda";