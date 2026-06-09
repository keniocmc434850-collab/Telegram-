const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const input = require("input");

// Bạn cần lấy API_ID và API_HASH tại my.telegram.org
const client = new TelegramClient(new StringSession(process.env.SESSION_STRING), parseInt(process.env.API_ID), process.env.API_HASH, {});

(async () => {
    await client.start({
        phoneNumber: process.env.PHONE_NUMBER,
        phoneCode: async () => await input.text("Mã xác thực: "),
        onError: (err) => console.log(err),
    });

    console.log("Userbot cá nhân đã sẵn sàng!");

    client.addEventHandler(async (event) => {
        const msg = event.message;
        if (msg.out || msg.isChannel || msg.isGroup) return;

        // Trả lời tự động sau 5 giây để tránh bị Telegram khóa
        setTimeout(async () => {
            await client.sendMessage(msg.senderId, {
                message: "Chào bạn, mình đang bận. Bạn vui lòng nhắn yêu cầu qua con bot này @Username_Bot_Cua_Ban để nhận bảng giá và hỗ trợ tự động nhé! Cảm ơn bạn."
            });
        }, 5000); 
    }, new NewMessage({}));
})();
