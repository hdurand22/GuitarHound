import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import {
  defaultHandler,
  newUrlHandler,
  notFoundHandler,
  helloHandler,
  scrapeHandler,
} from "./handler";

export const createServer = () => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors());

  // GET Routes
  app.get("/hello", helloHandler);
  app.get("/newurl", newUrlHandler);
  app.get("/newurl/:message", newUrlHandler);
  app.get("/api/scrape", scrapeHandler);
  app.get("/favicon.ico", notFoundHandler);

  // POST Routes

  // Static Serving
  app.use(express.static("static"));
  app.use(express.static("node_modules/bootstrap/dist"));
  app.use(defaultHandler);

  return app;
};
