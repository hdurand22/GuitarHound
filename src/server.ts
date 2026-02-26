import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { newUrlHandler } from "./handler";

export const createServer = () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors());

  // GET Routes
  app.get("/health", (req: Request, res: Response) => {
    res.json({ ok: true });
  });
  app.get("/newurl", newUrlHandler);
  app.get("/newurl/:message", newUrlHandler);
  app.get("/send-photo", (req: Request, res: Response) => {
    res.sendFile("Hayden.png", { root: "static" });
  });
  app.get("/download-photo", (req: Request, res: Response) => {
    res.download("static/Hayden.png");
  });

  // POST Routes
  app.post("/hello", (req: Request, res: Response) => {
    const name = req.body.name;
    res.json({ greeting: `Hello, ${name}` });
  });

  // Static Serving
  app.use(express.static("static"));
  app.use(express.static("node_modules/bootstrap/dist"));

  return app;
};

// const port = 3000;

// const server = createServer(app);

// server.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });
