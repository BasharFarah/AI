const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
    try {
        if (!process.env.CLAUDE_API_KEY) {
            return res.status(500).json({ error: "API Key مفقود في Railway" });
        }

        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            // استخدام الاسم العام للموديل لضمان القبول
            model: "claude-3-haiku-20240307", 
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
        // إذا استمر الخطأ، سنعرض رسالة واضحة جداً
        let msg = error.message;
        if (error.response && error.response.data) {
            msg = JSON.stringify(error.response.data.error.message);
        }
        res.status(500).json({ error: msg });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));