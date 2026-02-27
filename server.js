const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
    try {
        // التحقق من وجود المفتاح في إعدادات Railway
        if (!process.env.CLAUDE_API_KEY) {
            return res.status(500).json({ error: "خطأ: مفتاح CLAUDE_API_KEY غير موجود في إعدادات Variables بـ Railway." });
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
        // إرسال تفاصيل الخطأ بدقة للواجهة
        let details = error.message;
        if (error.response && error.response.data) {
            details = JSON.stringify(error.response.data);
        }
        res.status(500).json({ error: `حدث خطأ في الاتصال بـ Claude: ${details}` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));