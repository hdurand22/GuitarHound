"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const handler_1 = require("./handler");
const expressApp = (0, express_1.default)();
expressApp.use(express_1.default.json());
const port = 3000;
// GET Routes
expressApp.get("/newurl", handler_1.newUrlHandler);
expressApp.get("/newurl/:message", handler_1.newUrlHandler);
expressApp.get("/send-photo", (req, res) => {
    res.sendFile("Hayden.png", { root: "static" });
});
expressApp.get("/download-photo", (req, res) => {
    res.download("static/Hayden.png");
});
// POST Routes
expressApp.post("/hello", (req, res) => {
    const name = req.body.name;
    res.json({ greeting: `Hello, ${name}` });
});
// Static Serving
expressApp.use(express_1.default.static("static"));
expressApp.use(express_1.default.static("node_modules/bootstrap/dist"));
const server = (0, http_1.createServer)(expressApp);
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
