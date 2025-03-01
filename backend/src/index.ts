import express from "express";
import { AppDataSource } from "./data-source"; 

const app = express();
app.use(express.json());


AppDataSource.initialize()
  .then(() => {
    console.log("✅ Connected to PostgreSQL");

    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
  });

app.get("/", (req, res) => {
  res.send("Server is running and connected to DB!");
});
