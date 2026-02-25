import { createServer } from 'http';
import express, { Request, Response } from 'express';
import { newUrlHandler } from './handler';

const expressApp = express();
expressApp.use(express.json());
const port = 3000;

// GET Routes
expressApp.get("/newurl", newUrlHandler);
expressApp.get("/newurl/:message", newUrlHandler);
expressApp.get("/send-photo", (req: Request, res: Response) => {
    res.sendFile("Hayden.png", { root: "static" });
});
expressApp.get("/download-photo", (req: Request, res: Response) => {
    res.download("static/Hayden.png");
});

// POST Routes
expressApp.post("/hello", (req: Request, res: Response) => {
    const name = req.body.name;
    res.json({ greeting: `Hello, ${name}` });
});

// Static Serving
expressApp.use(express.static("static"));
expressApp.use(express.static("node_modules/bootstrap/dist"));

const server = createServer(expressApp);

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});