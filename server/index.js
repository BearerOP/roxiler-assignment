const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./db/dbConnection");

const PORT = process.env.PORT || 3000;

app.use(express.json());

const allowedOrigins = [
  "https://roxiler-assignment-4lvn.vercel.app",
  "https://roxiler-assignment-2-hcf2.onrender.com",
  "https://roxiler-assignment-one.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
];


const corsOptions = {
  origin: function (origin, callback) {
    console.log("Requested Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

db.connectDB();

app.use("/api", require("./src/routes/transactionRoutes"));

app.get("/", (req, res) => {
  res.send("Backend is Up :)");
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
