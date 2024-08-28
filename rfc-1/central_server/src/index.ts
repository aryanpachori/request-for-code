import express from "express";
import http from "http";
import WebSocket, { Server } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new Server({ noServer: true });

wss.on("connection", (ws: WebSocket) => {
  console.log("A new miner connected");

  
  ws.on("message", (message: WebSocket.MessageEvent) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === "new_block") {
        console.log("Received new block from a miner:", data.block);
        broadcast(JSON.stringify({ type: "block_added", block: data.block }));
      }
    } catch (error) {
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

function broadcast(message: string) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
