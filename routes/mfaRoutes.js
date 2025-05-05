import express from "express";
import { generateMFASetup, verifyMFA } from "../controllers/mfaController.js";

const router = express.Router();

router.get("/generate-auth-app-setup", async (req, res) => {
    try {
        const { username } = req.query;
        const result = await generateMFASetup(username);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/verify-mfa", async (req, res) => {
    try {
        const { username, token } = req.body;
        const result = await verifyMFA(username, token);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
