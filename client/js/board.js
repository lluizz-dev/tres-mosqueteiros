let aoClicarCasa = null;

export function definirCallbackClique(callback) {
    aoClicarCasa = callback;
}

export function renderizarTabuleiro(tabuleiro) {
    const container = document.getElementById("tabuleiro");
    container.innerHTML = "";

    for (let linha = 0; linha < tabuleiro.length; linha++) {
        for (let coluna = 0; coluna < tabuleiro[linha].length; coluna++) {
            const valor = tabuleiro[linha][coluna];
            const casa = document.createElement("div");
            casa.classList.add("casa");
            casa.dataset.linha = linha;
            casa.dataset.coluna = coluna;

            if (valor === 1) casa.classList.add("mosqueteiro");
            else if (valor === 2) casa.classList.add("guarda");
            else casa.classList.add("vazio");

            casa.addEventListener("click", () => {
                if (aoClicarCasa) aoClicarCasa(linha, coluna);
            });

            container.appendChild(casa);
        }
    }
}

export function marcarSelecionada(linha, coluna) {
    limparDestaques();
    const casa = obterCasa(linha, coluna);
    if (casa) casa.classList.add("selecionada");
}

export function destacarMovimentosValidos(posicoes) {
    for (const pos of posicoes) {
        const casa = obterCasa(pos.linha, pos.coluna);
        if (casa) casa.classList.add("destaque");
    }
}

export function limparDestaques() {
    document.querySelectorAll(".casa.selecionada").forEach(c => c.classList.remove("selecionada"));
    document.querySelectorAll(".casa.destaque").forEach(c => c.classList.remove("destaque"));
}

function obterCasa(linha, coluna) {
    return document.querySelector(`.casa[data-linha="${linha}"][data-coluna="${coluna}"]`);
}