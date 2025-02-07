import express from "express";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import { errorMiddleware } from "./middlewares/error.middleware";
import { app, server } from "./sockets/socket";
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

app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
