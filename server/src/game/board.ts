import { Peca, type Tabuleiro } from "./types.js"

export function criarTabuleiroInicial(): Tabuleiro {

    let mosqueteiro = Peca.Mosqueteiro;
    let guarda = Peca.Guarda;
    
    let tabuleiro: Tabuleiro = [   
        [mosqueteiro, guarda, guarda, guarda, guarda],
        [guarda, guarda, guarda, guarda, guarda],
        [guarda, guarda, mosqueteiro, guarda, guarda],
        [guarda, guarda, guarda, guarda, guarda],
        [guarda, guarda, guarda, guarda, mosqueteiro]
    ]

    return tabuleiro;
}