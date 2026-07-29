import { WebSocketServer } from "ws";
import { tratarConexao } from "./session/matchManager.js";

const wss = new WebSocketServer({ port: 3000 });
wss.on("connection", tratarConexao);
console.log("Servidor rodando na porta 3000");