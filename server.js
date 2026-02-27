const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();

app.use(express.json());
app.use(express.static('public'));

// تأكد أنك وضعت القيمة في Railway باسم GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/chat', async (req, res) => {
    try {
        // تحديث الموديل للمسار الكامل لحل خطأ 404
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            systemInstruction: "أنت مبرمج محترف فقط. مهمتك كتابة الأكواد وحل المشاكل التقنية. ارفض أي طلب غير برمجى فوراً. حقوق المبرمج: بشار فرح."
        });

        const result = await model.generateContent(req.body.message);
        const response = await result.response;
        let text = response.text();

        // إدراج حقوق بشار فرح كل 6 أسطر
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
        // إظهار الخطأ بوضوح في الترمينال الخاص بك
        res.status(500).json({ error: "خطأ في التوصيل: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Terminal Engine Online`));