import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import { errorMiddleware } from "./middlewares/error.middleware";
import { app, server } from "./sockets/socket";
import { getWords, throwError } from "./utils/helpers";
config();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.static("public"));
// For url inputs
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(morgan("dev"));
app.disable("x-powered-by");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ message: "Hello World", success: true });
});

app.get("/words", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { count } = req.query;
    const words = await getWords(Number(count) || 30);
    if (!words) return next(throwError("No words found", 404));

    res.status(200).json({
      success: true,
      data: words,
      message: "Words fetched successfully",
    });
  } catch (err: any) {
    return next(err);
  }
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
