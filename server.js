import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Pfade für statische Dateien
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname)));

// Middleware
app.use(cors());
app.use(express.json());

// OpenAI Key aus Environment
const API_KEY = process.env.OPENAI_API_KEY;

// KI-Route
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: "Du bist eine coole Minecraft-KI für DaySoMC." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const reply = data.output?.[0]?.content?.[0]?.text || "Die KI konnte leider nicht antworten 😢";
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.json({ reply: "Server Fehler 😢" });
  }
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server läuft auf Port ${PORT}`));
