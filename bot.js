const { Telegraf } = require('telegraf');
const { GoogleGenAI } = require('@google/genai');
const http = require('http');

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const BANG_GIA = `
🚀 BẢNG GIÁ KENIOS HAX GAME:
📱 PUBG IOS:
- VNHAX: 600K/Tháng, 300K/Tuần
- VNHAX MOD SKIN VN: 450K/Tháng, 225K/Tuần
- OASIS VIP: 800K/Tháng, 400K/Tuần
- KING: 900K/Tháng, 450K/Tuần
- TIMO VIP: 500K/Tháng, 250K/Tuần, 50K/Ngày
- VINGODL: 550K/Tháng, 250K/Tuần

🤖 PUBG ANDROID:
- ZOLO/MG/VNB: 500K/Tháng, 250K/Tuần
- ROOT: 650K/Tháng

⚔️ LIÊN QUÂN:
- Bản thường: 250K/Tháng, 120K/Tuần
- HYPER: 350K/Tháng, 150K/Tuần
- HYPER CHỐNG TỐ: 650K/Tháng

🏦 TPBANK: 44413438888 (TRẦN MINH CHIẾN)
🌐 Chi tiết: https://linkbio.co/KENIOS
`;

const SYSTEM_INSTRUCTION = `Bạn là trợ lý bán hàng Kenios. Sử dụng bảng giá này để tư vấn: ${BANG_GIA}. Trả lời tự nhiên, lịch sự, không thừa nhận là AI. Nếu khách chốt mua, luôn nhắc thanh toán qua TPBANK: 44413438888 - Trần Minh Chiến. KHÔNG BAO GIỜ nói "vui lòng đợi" hay "hệ thống bận".`;

bot.on('text', async (ctx) => {
    if (ctx.message.from.is_bot) return;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: ctx.message.text,
            config: { systemInstruction: SYSTEM_INSTRUCTION }
        });
        await ctx.reply(response.text);
    } catch (e) {
        ctx.reply("Dạ, bạn cần mình hỗ trợ về dịch vụ nào ạ?");
    }
});

bot.launch();
http.createServer((req, res) => res.end('Business Bot Running')).listen(process.env.PORT || 3000);
