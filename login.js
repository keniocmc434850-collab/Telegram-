const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");

const apiId = 31284153; // ID của bạn
const apiHash = "f14dca981db461bbee4e156efbc678a9"; // HASH của bạn

(async () => {
    const client = new TelegramClient(new StringSession(""), apiId, apiHash, {});
    await client.start({
        phoneNumber: async () => await input.text("Nhập số điện thoại (VD: +84912345678): "),
        phoneCode: async () => await input.text("Nhập mã OTP Telegram gửi về: "),
        onError: (err) => console.log(err),
    });
    console.log("Đăng nhập thành công! Đây là SESSION_STRING của bạn:");
    console.log(client.session.save()); // Copy đoạn mã dài ngoằng này
    process.exit();
})();
