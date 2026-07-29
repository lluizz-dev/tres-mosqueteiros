import type { Jogada, PapelJogador, Tabuleiro } from "../game/types.js";
import type { ResultadoJogo } from "../game/rules.js";

// Cliente -> Servidor
export type MensagemEntrar = { tipo: "entrar" };
export type MensagemJogada = { tipo: "jogada"; jogada: Jogada };
export type MensagemCliente = MensagemEntrar | MensagemJogada;

// Servidor -> Cliente
export type MensagemAguardando = { tipo: "aguardando" };
export type MensagemInicio = { tipo: "inicio"; papel: PapelJogador; tabuleiro: Tabuleiro; turno: PapelJogador };
export type MensagemEstado = { tipo: "estado"; tabuleiro: Tabuleiro; turno: PapelJogador };
export type MensagemJogadaInvalida = { tipo: "jogadaInvalida"; motivo: string };
export type MensagemFimDeJogo = { tipo: "fimDeJogo"; resultado: ResultadoJogo };
export type MensagemErro = { tipo: "erro"; motivo: string };

export type MensagemServidor =
    | MensagemAguardando
    | MensagemInicio
    | MensagemEstado
    | MensagemJogadaInvalida
    | MensagemFimDeJogo
    | MensagemErro;