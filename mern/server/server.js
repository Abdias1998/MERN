import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rate_limiter from "express-rate-limit";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 5050;

const app = express();
const origineClient = "http://localhost:5050";

app.use(cookieParser());
// app.use(helmet());

// ⚠️ express-rate-limit doit être configuré comme middleware
const limiter = rate_limiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requêtes par IP
});
app.use(limiter);

app.use(cors({ credentials: true, origin: origineClient }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use("/record", records);

// 👉 Sert le frontend buildé (React, par ex.)
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});
app.get("/create", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
