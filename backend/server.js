import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";

import clientRoute from "./routes/client.route.js";
import inverterRoute from "./routes/inverter.route.js";
import moduleRoute from "./routes/module.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());

app.use("/api/clients", clientRoute);
app.use("/api/inverters", inverterRoute);
app.use("/api/modules", moduleRoute);

connectDB().then(() => {
  app.listen(PORT, (err) => {
    if (err) {
      console.log(err);
    }
    console.log(`Server started at http://localhost:${PORT}`);
  });
});
