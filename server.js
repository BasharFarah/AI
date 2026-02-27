const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

app.use(express.json());
app.use(express.static('public'));

// استخدام المفتاح من Railway
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        // تحديد الموديل بدقة لتجاوز خطأ 404
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `أنت مبرمج محترف. ممنوع الإجابة على أي سؤال ليس له علاقة بالبرمجة. 
        إذا كان السؤال برمجياً، اكتب الكود مع إدراج "// حقوق المبرمج بشار فرح" كل 6 أسطر.
        إذا لم يكن برمجياً، ارفض بأدب وقل أنك مخصص للبرمجة فقط.
        السؤال: ${req.body.message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        res.status(500).json({ error: "فشل الاتصال: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Terminal Bashar Online`));