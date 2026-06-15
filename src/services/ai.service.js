const axios = require('axios');

class AIService {
    static async generateResponse(provider, apiKey, prompt, customUrl = '') {
        try {
            if (!apiKey) return "⚠️ AI Error: API Key belum dikonfigurasi.";

            if (provider === 'openai') {
                const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }]
                }, {
                    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
                });
                return response.data.choices[0].message.content.trim();
            } 
            
            if (provider === 'gemini') {
                const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                    contents: [{ parts: [{ text: prompt }] }]
                }, {
                    headers: { 'Content-Type': 'application/json' }
                });
                return response.data.candidates[0].content.parts[0].text.trim();
            }

            if (provider === 'custom' && customUrl) {
                const response = await axios.post(customUrl, { prompt }, {
                    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
                });
                return response.data.reply || response.data.response || "Format response custom tidak dikenali.";
            }

            return "⚠️ Provider AI tidak valid.";
        } catch (error) {
            console.error('[AI SERVICE ERROR]', error.message);
            return `❌ Gagal memproses AI: ${error.message}`;
        }
    }
}

module.exports = AIService;
