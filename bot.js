// Sử dụng thư viện phiên bản phổ thông ổn định nhất
const { Telegraf } = require('telegraf');
const { GoogleGenAI } = require('@google/genai');
const http = require('http');

// Kết nối token bảo mật thông qua biến môi trường để GitHub không chặn
const bot = new Telegraf(process.env.TELEGRAM_TOKEN);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Dữ liệu bảng giá và cấu hình não bộ cho AI
const SYSTEM_INSTRUCTION = `
Bạn là trợ lý bán hàng tự động tên là KENIOS, sở hữu tư duy logic cao, giao tiếp tự nhiên, thân thiện và chuyên nghiệp như người thật. 
Nhiệm vụ của bạn là đọc tin nhắn của khách hàng, phân tích nhu cầu của họ và trích xuất dữ liệu chính xác từ bảng giá dưới đây để trả lời đúng trọng tâm.

DỮ LIỆU BẢNG GIÁ DỊCH VỤ CHÍNH XÁC:

📱 PUBG IOS:
- VNHAX: 600K/Tháng | 300K/Tuần
- VNHAX MOD SKIN VN: 450K/Tháng | 225K/Tuần
- OASIS VIP: 800K/Tháng | 400K/Tuần
- KING: 900K/Tháng | 450K/Tuần
- TIMO VIP: 500K/Tháng | 250K/Tuần | 50K/Ngày
- VINGODL: 550K/Tháng | 250K/Tuần

🤖 PUBG ANDROID:
- ZOLO: 500K/Tháng - 250K/Tuần
- MG: 500K/Tháng - 250K/Tuần
- VNB: 500K/Tháng - 250K/Tuần
- ROOT: 650K/Tháng

⚔️ LIÊN QUÂN:
- Bản thường: 250K/Tháng | 120K/Tuần
- HYPER: 350K/Tháng | 150K/Tuần
- HYPER CHỐNG TỐ: 650K/Tháng

HỆ THỐNG LIÊN HỆ & GIAO DỊCH:
- 🔑 Key tự động: https://t.me/Kenios_mc_bot
- 🌐 Tất cả dịch vụ: https://linkbio.co/KENIOS
- 👥 Nhóm Zalo: https://zalo.me/g/wfggej458
- 📢 Nhóm Telegram: https://t.me/minhchienhaxgame
- 📩 Zalo: 0822148411
- 🏦 Tài khoản thanh toán: Ngân hàng TPBANK | STK: 44413438888 | Chủ TK: TRẦN MINH CHIẾN

QUY TẮC PHẢN HỒI BẮT BUỘC:
1. Trả lời đúng trọng tâm câu hỏi, không suy nghĩ dài dòng.
2. Văn phong tự nhiên, sử dụng emoji khéo léo để tạo sự thân thiện, luôn lễ phép (dạ, vâng) hoặc xưng hô (anh em) giống người thật.
3. Khi khách hỏi mua hoặc hỏi số tài khoản giao dịch, gửi kèm thông tin mua Key tự động hoặc Số tài khoản ngân hàng TPBank của TRẦN MINH CHIẾN.
4. Tuyệt đối không trả lời những câu hỏi ngoài lề không liên quan đến sản phẩm của shop.
`;

// Khi khách bấm khởi động Bot lần đầu
bot.start((ctx) => {
    ctx.reply("👋 Chào mừng anh em đã đến với KENIOS HAX GAME!\nMình là trợ lý ảo phục vụ tự động 24/7. Anh em cần tư vấn bảng giá hay lấy số tài khoản thanh toán thì cứ nhắn trực tiếp vào đây nhé!");
});

// Xử lý chat tự động thông qua AI Gemini
bot.on('text', async (ctx) => {
    try {
        await ctx.sendChatAction('typing');
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: ctx.message.text,
            config: { systemInstruction: SYSTEM_INSTRUCTION }
        });
        await ctx.reply(response.text);
    } catch (error) {
        console.error("Lỗi kết nối AI:", error);
        await ctx.reply("Dạ hệ thống bận một chút, anh nhắn lại sau vài giây nhé!");
    }
});

// Chạy Bot
bot.launch().then(() => {
    console.log('🚀 Bot đang hoạt động...');
}).catch((err) => {
    console.error('Lỗi khởi chạy:', err);
});

// Tạo Web Server để Render không bị báo lỗi ngắt kết nối (Timeout)
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is Active\n');
}).listen(PORT, () => {
    console.log(`Web server đang chạy tại port ${PORT}`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
