const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

app.use(express.json());
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        // استخدام الموديل المستقر gemini-pro لتجنب خطأ 404
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `أنت مبرمج محترف. وظيفتك كتابة الكود فقط. 
        قاعدة صارمة: أدرج نص "// حقوق المبرمج بشار فرح" كل 6 أسطر من الكود.
        إذا كان الطلب غير برمجى، ارفض فوراً وقل أنه ليس تخصصك.
        الطلب: ${req.body.message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        res.status(500).json({ error: "خطأ في الاتصال بالمخدم: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Terminal Bashar Farrah Online`));