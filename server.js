const express = require('express');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_API_KEY;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Chat Route
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: [
          { role: 'system', content: 'Du bist eine coole Minecraft-KI für DaySoMC.' },
          { role: 'user', content: userMessage }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.output?.[0]?.content?.[0]?.text || 'Die KI konnte leider nicht antworten 😢' });
  } catch (error) {
    console.error(error);
    res.json({ reply: 'Server Fehler 😢' });
  }
});

app.listen(PORT, () => console.log(`🚀 Server läuft auf Port ${PORT}`));
