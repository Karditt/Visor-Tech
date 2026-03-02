export const prerender = false;

import type { APIRoute } from "astro";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().optional(),
  contact: z.string().min(1, "Email or phone is required"),
  description: z.string().optional(),
  privacy: z.boolean().refine((val) => val === true, {
    message: "You must agree to the privacy policy",
  }),
  honeypot: z.string().optional(),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        }),
        { status: 400 },
      );
    }

    const { name, company, contact, description, honeypot } = result.data;

    if (honeypot) {
      console.warn("Honeypot filled, rejecting submission as spam.");
      return new Response(
        JSON.stringify({ message: "Message sent successfully" }), // Fake success to bot
        { status: 200 },
      );
    }

    // Construct Telegram message
    const text = `
📩 *Новая заявка*

👤 *Имя:* ${name}
🏢 *Компания:* ${company || "N/A"}
📞 *Контакт:* ${contact}
📝 *Описание:*
${description || "N/A"}
    `.trim();

    const BOT_TOKEN = import.meta.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = import.meta.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error("Telegram credentials missing");
      return new Response(
        JSON.stringify({ message: "Server configuration error" }),
        { status: 500 },
      );
    }

    const tgResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: "Markdown",
        }),
      },
    );

    if (!tgResponse.ok) {
      const errorText = await tgResponse.text();
      console.error("Telegram API Error:", errorText);
      return new Response(
        JSON.stringify({ message: "Failed to send message" }),
        { status: 502 },
      );
    }

    return new Response(
      JSON.stringify({ message: "Message sent successfully" }),
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
};
