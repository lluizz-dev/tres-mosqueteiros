import { iniciarConexao } from "./connection.js";

const botao = document.getElementById("botao-iniciar");

botao.addEventListener("click", () => {
    botao.classList.add("escondido");
    iniciarConexao();
});