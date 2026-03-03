import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// This webhook handles scheduled cron actions OR Telegram bot commands
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Very basic simple TG Bot Webhook handling
        if (body.message) {
            const chatId = body.message.chat.id;
            const text = body.message.text;

            // Example: "start" command could be recorded, etc.
            if (text === "/start") {
                // Here we'd map TG ID to user or just send welcome message
            }

            return NextResponse.json({ ok: true });
        }

        // CRON JOB TO PROCESS REMINDERS
        if (body.cron === "process_reminders") {
            const now = new Date();
            // Find all active reminders that are due
            const dueReminders = await prisma.reminder.findMany({
                where: {
                    active: true,
                    nextAt: { lte: now }
                },
                include: { user: true }
            });

            for (const reminder of dueReminders) {
                if (reminder.user.tgId) {
                    // Send TG message
                    const botToken = process.env.BOT_TOKEN;
                    if (botToken) {
                        try {
                            const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
                            await fetch(tgUrl, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    chat_id: reminder.user.tgId.toString(),
                                    text: `🕒 Напоминание: ${reminder.title}\nВремя приема подошло.`
                                })
                            });
                        } catch (e) {
                            console.error("Failed to send TG message", e);
                        }
                    }
                }

                // Update nextAt
                const nextAt = new Date(reminder.nextAt);
                nextAt.setHours(nextAt.getHours() + (reminder.intervalHours || 0));

                await prisma.reminder.update({
                    where: { id: reminder.id },
                    data: { nextAt }
                });
            }

            return NextResponse.json({ processed: dueReminders.length });
        }

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error("Webhook error:", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
