const { Telegraf } = require('telegraf');
const { GoogleGenAI } = require('@google/genai');
const http = require('http');

// ==========================================
// KẾT NỐI BẢO MẬT QUA BIẾN MÔI TRƯỜNG (DÙNG ĐỂ QUA MẶT GITHUB)
// ==========================================
const bot = new Telegraf(process.env.TELEGRAM_TOKEN); 
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ==========================================
// BỘ NÃO AI: DỮ LIỆU TẬP TIN BẢNG GIÁ VÀ LOGIC
// ==========================================
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
1. Trả lời đúng trọng tâm câu hỏi, không suy nghĩ dài dòng:
   - Nếu khách chỉ hỏi về "android" hoặc "adr", CHỈ lọc ra danh sách của Android.
   - Nếu khách chỉ hỏi về "ios", CHỈ lọc ra danh sách của iOS.
   - Nếu khách hỏi về "pubg" nói chung, liệt kê ngắn gọn cả hai nền tảng iOS và Android.
   - Nếu khách hỏi về "liên quân" hoặc "lq", trả về bảng giá Liên Quân.
2. Văn phong tự nhiên, sử dụng emoji khéo léo để tạo sự thân thiện, luôn lễ phép (dạ, vâng) hoặc xưng hô (anh em) giống người thật, có câu chào mở đầu và cảm ơn ở cuối.
3. Khi khách hỏi mua hoặc hỏi số tài khoản giao dịch, gửi kèm thông tin mua Key tự động hoặc Số tài khoản ngân hàng TPBank của TRẦN MINH CHIẾN để họ tiện chuyển khoản.
4. Tuyệt đối không trả lời những câu hỏi ngoài lề không liên quan đến sản phẩm và trò chơi của shop.
`;

// ==========================================
// QUY TRÌNH VẬN HÀNH BOT TELEGRAM
// ==========================================

// Khi khách hàng nhấn lệnh /start hoặc bắt đầu chat lần đầu
bot.start((ctx) => {
    ctx.reply(
        `👋 Chào mừng anh em đã đến với KENIOS HAX GAME!\n\n` +
        `Mình là trợ lý ảo phục vụ tự động 24/7. Anh em cần tư vấn bảng giá PUBG iOS, Android, Liên Quân hay lấy số tài khoản thanh toán thì cứ nhắn trực tiếp vào đây nhé! Chúc anh em một ngày vui vẻ.`
    );
});

// Lắng nghe và xử lý toàn bộ hội thoại từ khách hàng
bot.on('text', async (ctx) => {
    const userMessage = ctx.message.text;

    try {
        // Tạo hiệu ứng "bot đang gõ..." cho giống người thật
        await ctx.sendChatAction('typing');

        // Gọi API Gemini xử lý dữ liệu với model tối ưu nhất
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION
            }
        });

        // Trả lời khách hàng dạng text thuần (Tránh lỗi vỡ định dạng ký tự làm crash sập bot)
        await ctx.reply(response.text);

    } catch (error) {
        console.error("Lỗi hệ thống AI:", error);
        await ctx.reply("Dạ hệ thống đang bận xử lý dữ liệu một chút, anh vui lòng đợi vài giây rồi nhắn lại giúp em nhé!");
    }
});

// Kích hoạt bot Telegram
bot.launch().then(() => {
    console.log('🚀 Bot Trợ Lý AI KENIOS đang hoạt động ổn định...');
}).catch((err) => {
    console.error('Lỗi khởi chạy Telegram:', err);
});

// ==========================================
// WEB SERVER BIND PORT GIỮ SỐNG BOT CHO RENDER (SỬA LỖI TIMEOUT)
// ==========================================
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('KENIOS Bot is running 24/7\n');
}).listen(PORT, () => {
    console.log(`Web server giữ live đang chạy tại port ${PORT}`);
});

// Ngắt bot an toàn khi bảo trì hoặc tắt server
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
