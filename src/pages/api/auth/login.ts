import type { APIRoute } from "astro";
import { createToken, COOKIE_NAME } from "../../../lib/auth";

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { password } = body;

    const adminPassword = import.meta.env.ADMIN_PASSWORD || "admin";

    if (password !== adminPassword) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
      });
    }

    const token = await createToken({ role: "admin" });

    cookies.set(COOKIE_NAME, token, {
      path: "/",
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 hours
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
};
