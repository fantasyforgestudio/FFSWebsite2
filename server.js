import express from "express";
import cors from "cors";
import mfaRoutes from "./routes/mfaRoutes.js"; // Correct import for MFA
import authRoutes from "./routes/authRoutes.js"; // New import for authentication
import fs from "fs";
import testRoutes from "./routes/testRoutes.js";

console.log("Checking if .env.backend file exists:", fs.existsSync("./config/.env.backend"));
console.log("Loaded Environment Variables:");
console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
console.log("FIREBASE_CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("FIREBASE_PRIVATE_KEY:", process.env.FIREBASE_PRIVATE_KEY ? "Exists" : "MISSING");



const app = express();
app.use(cors());
app.use(express.json());

app.use(mfaRoutes); //  Register service routes
app.use(authRoutes); // Register auth routes (login, signup, etc.)
app.use(testRoutes); // Activate test routes

const PORT = 3000;
app.listen(PORT, () => {
    console.log(` Server running at http://localhost:${PORT}`);
});

process.env.GRPC_VERBOSITY = "DEBUG";
process.env.GRPC_TRACE = "all";

export default app