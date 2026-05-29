"use strict";

const vazio = 0
const mosqueteiro = 1;
const guarda = 2;
let tabuleiro = [
        [mosqueteiro, guarda, guarda,      guarda, guarda     ],
        [guarda,      guarda, guarda,      guarda, guarda     ],
        [guarda,      guarda, mosqueteiro, guarda, guarda     ],
        [guarda,      guarda, guarda,      guarda, guarda     ],
        [guarda,      guarda, guarda,      guarda, mosqueteiro],
    ];
const divTabuleiro = document.getElementById('tabuleiro');
let vezAtual = mosqueteiro;
let mosqueteiroSelecionado;
let guardaSelecionado;

function criarTabuleiro() {

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
                if (casa.classList.contains('destacado') === false) {
                    varrerDestaques();
                }
                if (posicaoAtual === mosqueteiro) {
                    mosqueteiroSelecionado = casa;
                }
                else if (posicaoAtual === guarda) {
                    guardaSelecionado = casa;
                }
                movimentacao(i, j, casa);
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

function mudarVez() {
    if (vezAtual === mosqueteiro) {
        vezAtual = guarda;
    }
    else {
        vezAtual = mosqueteiro;
    }
    mensagemVez();
}

criarTabuleiro();
mensagemVez();

function movimentacao(i, j, lugar) {
    let posicaoClique = tabuleiro[i][j];
    let casa;

    if (posicaoClique !== vezAtual && lugar.classList.contains('destacado') === false) {
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
    else if (posicaoClique === guarda) {
        casa = document.querySelector(`[data-linha="${i}"][data-coluna="${j}"]`);

        if (casa.classList.contains('destacado')) {
            let linhaMosqueteiro = Number(mosqueteiroSelecionado.dataset.linha);
            let colunaMosqueteiro = Number(mosqueteiroSelecionado.dataset.coluna);

            tabuleiro[i][j] = mosqueteiro;
            tabuleiro[linhaMosqueteiro][colunaMosqueteiro] = vazio;

            divTabuleiro.innerHTML = '';
            
            mudarVez();
            criarTabuleiro();
            if (verificacaoGameOver()) {
                // guardas venceram!
            }
        }
        else {
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
                    if (tabuleiro[novaLinha][novaColuna] === vazio) {
                        casa = document.querySelector(`[data-linha="${novaLinha}"][data-coluna="${novaColuna}"]`);
                        casa.classList.add('destacado');
                    }
                }
            }
        }
    }
    else if (posicaoClique === vazio) {
        casa = document.querySelector(`[data-linha="${i}"][data-coluna="${j}"]`);

        if (casa.classList.contains('destacado')) {
            let linhaGuarda = Number(guardaSelecionado.dataset.linha);
            let colunaGuarda = Number(guardaSelecionado.dataset.coluna);

            tabuleiro[i][j] = guarda;
            tabuleiro[linhaGuarda][colunaGuarda] = vazio;

            divTabuleiro.innerHTML = '';
            
            mudarVez();
            criarTabuleiro();
            if (verificacaoGameOver()) {
                // mosqueteiros venceram!
            }
        }
    }
}

function varrerDestaques() {
    let destaques = document.querySelectorAll('.destacado');
    for (const destaque of destaques) {
        destaque.classList.remove('destacado');
    }
}

function verificacaoGameOver() {
    let soma = 0;

    if (vezAtual === guarda) {
        for (let i = 0; i < tabuleiro.length; i++) {
            for (let j = 0; j < tabuleiro[i].length; j++) {
                if (tabuleiro[i][j] === mosqueteiro) soma++;
            }
            if (soma === 3) return true;
            else soma = 0;
        }
        for (let i = 0; i < tabuleiro.length; i++) {
            for (let j = 0; j < tabuleiro[i].length; j++) {
                if (tabuleiro[j][i] === mosqueteiro) soma++;
            }
            if (soma === 3) return true;
            else soma = 0;
        }
    }
    else if (vezAtual === mosqueteiro) {
        let temGuardas = false;
        const direcoes = [[-1,0],[1,0],[0,-1],[0,1]];

        for (let i = 0; i < tabuleiro.length; i++) {
            for (let j = 0; j < tabuleiro[i].length; j++) {
                if (tabuleiro[i][j] === mosqueteiro) {
                    for (const [di, dj] of direcoes) {
                        let novaLinha = i + di;
                        let novaColuna = j + dj;

                        if (novaLinha >= 0 && novaLinha < 5 && novaColuna >= 0 && novaColuna < 5) {
                            if (tabuleiro[novaLinha][novaColuna] === guarda) {
                                temGuardas = true;
                            }
                        }
                    }
                }
            }
        }

        return temGuardas;
    }

    return false;
}