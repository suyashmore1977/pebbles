require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const models = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro-latest"];

    for (const modelName of models) {
        try {
            console.log(`Testing ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            console.log(`SUCCESS: ${modelName}`);
            console.log(result.response.text());
            return; // Exit on first success
        } catch (error) {
            console.error(`FAILED: ${modelName} - ${error.status || error.message}`);
        }
    }
}

testGemini();
