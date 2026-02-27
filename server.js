const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
    try {
        if (!process.env.CLAUDE_API_KEY) {
            return res.status(500).json({ error: "API Key مفقود في إعدادات السيرفر." });
        }

        const response = await axios.post('https://api.anthropic.com/v1/messages', {
         model: "claude-3-sonnet-20240229",
            max_tokens: 1500,
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
        let errorMsg = "حدث خطأ غير متوقع";
        if (error.response && error.response.data) {
            errorMsg = error.response.data.error.message;
        }
        res.status(500).json({ error: errorMsg });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));