"use strict";

const vazio = 0
const mosqueteiro = 1;
const guarda = 2;

function criarTabuleiro() {
    const divTabuleiro = document.getElementById('tabuleiro');

    let tabuleiro = [
        [mosqueteiro, guarda, guarda,      guarda, guarda     ],
        [guarda,      guarda, guarda,      guarda, guarda     ],
        [guarda,      guarda, mosqueteiro, guarda, guarda     ],
        [guarda,      guarda, guarda,      guarda, guarda     ],
        [guarda,      guarda, guarda,      guarda, mosqueteiro],
    ];

    for (let i = 0; i < tabuleiro.length; i++) {
        for (let j = 0; j < tabuleiro[i].length; j++) {
            let posicaoAtual = tabuleiro[i][j];
            let casa = document.createElement('div');

            if (posicaoAtual == vazio) {
                casa.classList.add('casa', 'vazio');
            }
            else if (posicaoAtual == mosqueteiro) {
                casa.classList.add('casa', 'mosqueteiro');
            }
            else {
                casa.classList.add('casa', 'guarda');
            }

            divTabuleiro.appendChild(casa);
        }
    }
}

criarTabuleiro()