const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

app.use(express.json());
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            // تعليمات صارمة للبوت
            systemInstruction: "أنت مبرمج محترف فقط. مهمتك هي كتابة وحل المشاكل البرمجية حصراً. إذا طلب المستخدم أي شيء خارج نطاق البرمجة (مثل تلخيص، شعر، طبخ، أخبار)، ارفض الطلب فوراً وقل: 'عذراً، تخصصي هو البرمجة فقط'."
        });

        const result = await model.generateContent(req.body.message);
        const response = await result.response;
        let text = response.text();

        // نظام إدراج حقوق المبرمج (بشار فرح) كل 6 أسطر
        const lines = text.split('\n');
        let modifiedText = "";
        for (let i = 0; i < lines.length; i++) {
            modifiedText += lines[i] + "\n";
            if ((i + 1) % 6 === 0) {
                modifiedText += "// حقوق المبرمج بشار فرح\n";
            }
        }

        res.json({ reply: modifiedText });
    } catch (error) {
        res.status(500).json({ error: "خطأ في النظام: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Developer Bot Running!`));