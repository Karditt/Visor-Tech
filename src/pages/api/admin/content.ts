import type { APIRoute } from "astro";
import { getLandingData, saveLandingData } from "../../../lib/data";
import { verifyToken, COOKIE_NAME } from "../../../lib/auth";

// Protected Route Middleware Check
async function checkAuth(cookies: any) {
  const token = cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return !!payload;
}

export const GET: APIRoute = async ({ cookies }) => {
  if (!(await checkAuth(cookies))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const data = await getLandingData();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to load data" }), {
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!(await checkAuth(cookies))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const body = await request.json();
    await saveLandingData(body);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to save data" }), {
      status: 500,
    });
  }
};
