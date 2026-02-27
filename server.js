const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

app.post('/api/chat', async (req, res) => {
    try {
        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 2000,
            system: "أنت مساعد منصة 'ملخصاتي'، خبير في تلخيص الكتب والمناهج الدراسية بأسلوب شيق ومنظم.",
            messages: [{ role: "user", content: req.body.prompt }],
        });
        res.json({ text: response.content[0].text });
    } catch (err) {
        res.status(500).json({ error: "حدث خطأ في الاتصال بـ Claude" });
    }
});

app.listen(process.env.PORT || 3000);