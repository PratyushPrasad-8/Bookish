import express from "express";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRotes.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
const app = express();
const PORT= process.env.PORT || 5000;

//Creating middleware
app.use(express.json());//Mandatory to use req.body
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});