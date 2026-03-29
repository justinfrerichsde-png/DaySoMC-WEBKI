import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔐 API Key (hier einsetzen!)
const API_KEY = "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";

// Route für Chat
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
          {
            role: "system",
            content: "Du bist eine coole Minecraft KI für DaySoMC. Antworte locker und hilfreich."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    // Antwort sicher rausziehen
    const reply =
      data.output?.[0]?.content?.[0]?.text ||
      "Keine Antwort von der KI 😢";

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.json({ reply: "Server Fehler 😢" });
  }
});

// Server starten
app.listen(3000, () => {
  console.log("🚀 Server läuft auf http://localhost:3000");
});
