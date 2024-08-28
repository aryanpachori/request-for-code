"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importStar(require("ws"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.Server({ noServer: true });
wss.on("connection", (ws) => {
    console.log("A new miner connected");
    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message.toString());
            if (data.type === "new_block") {
                console.log("Received new block from a miner:", data.block);
                broadcast(JSON.stringify({ type: "block_added", block: data.block }));
            }
        }
        catch (error) {
            console.error("Error parsing message:", error);
        }
    });
    ws.on("close", () => {
        console.log("A miner disconnected");
    });
});
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});
server.listen(3000, () => {
    console.log("WebSocket server running on port 3000");
});
function broadcast(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === ws_1.default.OPEN) {
            client.send(message);
        }
    });
}
