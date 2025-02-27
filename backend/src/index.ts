import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
