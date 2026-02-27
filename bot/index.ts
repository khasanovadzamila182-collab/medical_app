import { Telegraf, Markup } from "telegraf";
import "dotenv/config";

const BOT_TOKEN = process.env.BOT_TOKEN;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app";

if (!BOT_TOKEN) {
    console.error("❌ BOT_TOKEN not set in .env — get one from @BotFather");
    process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// ─── /start command → opens WebApp ────────────────────────────
bot.start((ctx) => {
    const name = ctx.from.first_name || "Мама";
    ctx.reply(
        `Привет, ${name}! 👋\n\nЯ — Mama-Expert, ваш помощник при ОРВИ у ребёнка.\n\n🌡️ Авто-расчёт дозировок по весу\n👃 Пошаговые протоколы лечения\n⏰ Таймер напоминаний\n\nНажмите кнопку ниже, чтобы открыть приложение:`,
        Markup.inlineKeyboard([
            [Markup.button.webApp("🚀 Открыть Mama-Expert", APP_URL)],
        ])
    );
});

// ─── /help command ────────────────────────────────────────────
bot.help((ctx) => {
    ctx.reply(
        "📋 Доступные команды:\n\n" +
        "/start — Открыть приложение\n" +
        "/dose <вес> — Быстрый расчёт дозы (пример: /dose 13.5)\n" +
        "/help — Помощь\n\n" +
        "Или нажмите кнопку ниже:",
        Markup.inlineKeyboard([
            [Markup.button.webApp("🚀 Открыть Mama-Expert", APP_URL)],
        ])
    );
});

// ─── /dose command — quick dosage calculation ─────────────────
bot.command("dose", (ctx) => {
    const args = ctx.message.text.split(" ");
    const weight = parseFloat(args[1]);

    if (!weight || weight <= 0 || weight > 60) {
        ctx.reply("⚠️ Укажите вес ребёнка в кг.\nПример: /dose 13.5");
        return;
    }

    const paracetamol = Math.round(weight * 0.625 * 10) / 10;
    const ibuprofen = Math.round((weight / 2) * 10) / 10;

    ctx.reply(
        `💊 Расчёт дозировок для веса ${weight} кг:\n\n` +
        `🔵 Парацетамол (120мг/5мл): ${paracetamol} мл\n` +
        `   ↳ Каждые 4-6 ч, макс 4 раза/сут\n\n` +
        `🟢 Ибупрофен (100мг/5мл): ${ibuprofen} мл\n` +
        `   ↳ Каждые 6-8 ч, макс 3 раза/сут, после еды\n\n` +
        `⚠️ Не комбинируйте без назначения врача!`,
        { parse_mode: "HTML" }
    );
});

// ─── Timer reminder system (Таймер Заботы) ────────────────────
// When a user logs an action from the WebApp, the WebApp calls
// POST /api/reminder which triggers this function:
export function scheduleReminder(
    chatId: number,
    drugName: string,
    delayHours: number
) {
    const delayMs = delayHours * 60 * 60 * 1000;

    setTimeout(() => {
        bot.telegram.sendMessage(
            chatId,
            `⏰ Напоминание!\n\n` +
            `Пора дать ${drugName}.\n` +
            `Проверьте температуру перед приёмом.`,
            Markup.inlineKeyboard([
                [Markup.button.webApp("📋 Открыть протокол", APP_URL + "/temp")],
                [Markup.button.callback("✅ Принято", "taken_" + Date.now())],
            ])
        );
    }, delayMs);

    console.log(`⏰ Reminder scheduled: ${drugName} in ${delayHours}h for chat ${chatId}`);
}

// Handle "taken" callback
bot.action(/^taken_/, (ctx) => {
    ctx.answerCbQuery("✅ Отмечено!");
    const msg = ctx.callbackQuery.message;
    if (msg && "text" in msg) {
        ctx.editMessageText(msg.text + "\n\n✅ Принято!");
    }
});

// ─── Launch bot ───────────────────────────────────────────────
bot.launch().then(() => {
    console.log("🤖 Mama-Expert bot is running!");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
