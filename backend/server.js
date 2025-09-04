import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";

import clientRoutes from "./routes/client.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use("/api/clients", clientRoutes);

connectDB().then(() => {
  app.listen(PORT, (err) => {
    if (err) {
      console.log(err);
    }
    console.log(`Server started at http://localhost:${PORT}`);
  });
});
