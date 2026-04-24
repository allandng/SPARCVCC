require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';

app.post('/api/claude', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  try {
    const response = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 600,
      }),
    });
    const data = await response.json();
    if (data.error) throw new Error(`DeepSeek: ${data.error.message}`);
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('DeepSeek returned no text in response');
    res.json({ text });
  } catch (err) {
    console.error('DeepSeek API error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Hail Mary running at http://localhost:${PORT}`));
}

module.exports = app;
