const express = require('express');
const axios = require('axios'); // تأكد من تثبيت axios
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/chat', async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        // الاستدعاء المباشر لرابط API لتجنب أخطاء المكتبة
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const prompt = `أنت مبرمج محترف. أجب فقط على الأسئلة البرمجية. 
        يجب أن تضع الجملة التالية كتعليق "// حقوق المبرمج بشار فرح" كل 6 أسطر من الكود.
        إذا كان الطلب غير برمجى، ارفض بأدب.
        الطلب: ${req.body.message}`;

        const response = await axios.post(url, {
            contents: [{ parts: [{ text: prompt }] }]
        });

        const text = response.data.candidates[0].content.parts[0].text;
        res.json({ reply: text });

    } catch (error) {
        res.status(500).json({ error: "فشل نهائي في الاتصال: " + (error.response?.data?.error?.message || error.message) });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BASHAR ENGINE START`));