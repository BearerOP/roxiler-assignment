const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./db/dbConnection");

const PORT = process.env.PORT || 3000;

app.use(cors(
  'https://roxiler-assignment-4lvn.vercel.app',
  'https://roxiler-assignment-2-hcf2.onrender.com',
  'http://localhost:3000',
  'http://localhost:5173',
  

));
app.use(express.json());

db.connectDB();

app.use("/api", require("./src/routes/transactionRoutes"));

app.get("/", (req, res) => {
  res.send("Backend is Up :)");
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
