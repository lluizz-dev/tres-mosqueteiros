"use strict";

const vazio = 0
const mosqueteiro = 1;
const guarda = 2;
let tabuleiro;
const divTabuleiro = document.getElementById('tabuleiro');
let vezAtual = mosqueteiro;

function criarTabuleiro() {

    tabuleiro = [
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

            if (posicaoAtual === vazio) {
                casa.classList.add('casa', 'vazio');
            }
            else if (posicaoAtual === mosqueteiro) {
                casa.classList.add('casa', 'mosqueteiro');
            }
            else {
                casa.classList.add('casa', 'guarda');
            }

            casa.addEventListener('click', function() {
                movimentacao(i, j);
            });

            casa.dataset.linha = i;
            casa.dataset.coluna = j;

            divTabuleiro.appendChild(casa);
        }
    }
}

function mensagemVez() {
    const h1MensagemVez = document.querySelector('#mensagem');

    if (vezAtual === mosqueteiro) {
        h1MensagemVez.textContent = "Vez do mosqueteiro!";
    }
    else {
        h1MensagemVez.textContent = "Vez do guarda!";
    }
}

function mudarVez(ultimaVez) {
    if (ultimaVez === mosqueteiro) {
        vezAtual = guarda;
    }
    else {
        vezAtual = mosqueteiro;
    }
    mensagemVez();
}

criarTabuleiro();
mensagemVez();

function movimentacao(i, j) {
    let posicaoClique = tabuleiro[i][j];
    let casa;

    if (posicaoClique !== vezAtual) {
        return;
    }

    if (posicaoClique === mosqueteiro) {
        const direcoes = [
            [-1, 0], // cima
            [1, 0],  // baixo
            [0, -1], // esquerda
            [0, 1]   // direita
        ];

        for (const [di, dj] of direcoes) {
            let novaLinha = i + di;
            let novaColuna = j + dj;

            if (novaLinha >= 0 && novaLinha < 5 && novaColuna >= 0 && novaColuna < 5) {
                if (tabuleiro[novaLinha][novaColuna] === guarda) {
                    casa = document.querySelector(`[data-linha="${novaLinha}"][data-coluna="${novaColuna}"]`);
                    casa.classList.add('destacado');
                }
            }
        }
    }
}