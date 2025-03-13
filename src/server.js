import express from "express";
import cors from "cors";
import taskRoutes from "./routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
  origin: "https://glistening-vacherin-45f36f.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.listen(port, () => console.log(`Server running at ${port}`));
