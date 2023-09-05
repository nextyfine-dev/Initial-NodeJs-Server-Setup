import http from "node:http";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import { nodeEnv } from "./config/constants.js";
import { NODE_ENV, settings } from "./config/index.js";
import { LoggerStream } from "./logs/logger.js";
import { sendSuccessRes } from "./services/serverService.js";
import AppError from "./utils/AppError.js";
import { StatusCodes } from "http-status-codes";
import errorController from "./controllers/errorController.js";
import router from "./routes/index.js";

const app = express();

const httpServer = settings.usingWs ? http.createServer(app) : app;

app.use(cors());
app.use(helmet());
app.use(compression());

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "1mb" }));

if (NODE_ENV === nodeEnv.development) {
  app.use(morgan("dev", { stream: new LoggerStream() }));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use(limiter);

app.get("/", (_, res) => sendSuccessRes(res, "Welcome to E-Commerce API"));

app.get("/robots.txt", (_, res) => {
  res.type("text/plain");
  res.send("User-agent: *\nDisallow: /");
});

app.use("/api/v1", router);

app.all("*", (req, _, next) =>
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      StatusCodes.NOT_FOUND
    )
  )
);

app.use(errorController);

export default httpServer;
