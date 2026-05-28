"use strict";

const vazio = 0
const mosqueteiro = 1;
const guarda = 2;

function criarTabuleiro() {
    let tabuleiro = [
        [mosqueteiro, guarda, guarda,      guarda, guarda     ],
        [guarda,      guarda, guarda,      guarda, guarda     ],
        [guarda,      guarda, mosqueteiro, guarda, guarda     ],
        [guarda,      guarda, guarda,      guarda, guarda     ],
        [guarda,      guarda, guarda,      guarda, mosqueteiro],
    ];
}