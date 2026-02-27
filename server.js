const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
    try {
        // فحص وجود المفتاح في السيرفر
        if (!process.env.CLAUDE_API_KEY) {
            console.error("ERROR: CLAUDE_API_KEY is missing in Railway Variables!");
            return res.status(500).json({ error: "Missing API Key" });
        }

        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 1024,
            messages: [{ role: "user", content: req.body.message }]
        }, {
            headers: {
                'x-api-key': process.env.CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            }
        });

        res.json({ reply: response.data.content[0].text });
    } catch (error) {
        // طباعة تفاصيل الخطأ في Logs لتعرف السبب
        console.error("--- API ERROR DETAILS ---");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", JSON.stringify(error.response.data));
        } else {
            console.error("Message:", error.message);
        }
        res.status(500).json({ error: "حدث خطأ في الاتصال بـ Claude" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));