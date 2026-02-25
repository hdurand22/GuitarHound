"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultHandler = exports.newUrlHandler = exports.notFoundHandler = void 0;
const notFoundHandler = (req, res) => {
    res.sendStatus(404);
};
exports.notFoundHandler = notFoundHandler;
const newUrlHandler = (req, res) => {
    const message = req.params.message ?? "(No Message)";
    res.send(`Hello, ${message}`);
};
exports.newUrlHandler = newUrlHandler;
const defaultHandler = async (req, res) => {
    if (req.query.keyword) {
        res.send(`Hello, ${req.query.keyword}`);
    }
    else {
        res.send(`Hello, ${req.protocol.toUpperCase()}`);
    }
};
exports.defaultHandler = defaultHandler;
