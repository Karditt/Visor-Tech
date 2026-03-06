import { defineMiddleware } from "astro:middleware";

// Default password if not set in .env
const PASSWORD = import.meta.env.SITE_PASSWORD || "vizortex2024";

function renderMaintenancePage(urlPath: string, showError = false) {
  return new Response(
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Website Under Maintenance - Vizortex</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #0f172a; color: white; }
        .container { text-align: center; background: #1e293b; padding: 3rem; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); max-width: 90%; width: 400px; border: 1px solid #334155; }
        h1 { margin-top: 0; font-size: 1.5rem; color: #e2e8f0; font-weight: 600; margin-bottom: 0.5rem; }
        p { color: #94a3b8; margin-bottom: 2rem; font-size: 0.95rem; line-height: 1.5; }
        .error { color: #ef4444; margin-bottom: 1rem; font-size: 0.9rem; display: ${showError ? "block" : "none"}; padding: 0.5rem; background: rgba(239, 68, 68, 0.1); border-radius: 0.375rem; border: 1px solid rgba(239, 68, 68, 0.2); }
        input[type="password"] { width: 100%; box-sizing: border-box; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #334155; background: #0f172a; color: white; margin-bottom: 1rem; font-size: 1rem; transition: border-color 0.2s; }
        input[type="password"]:focus { outline: none; border-color: #3b82f6; }
        button { width: 100%; padding: 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 1rem; cursor: pointer; transition: background 0.2s; }
        button:hover { background: #2563eb; }
        .logo { margin-bottom: 1.5rem; display: flex; justify-content: center; }
        .logo-box { background: #0f172a; padding: 1rem; border-radius: 1rem; border: 1px solid #334155; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <div class="logo-box">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
        </div>
        <h1>Сайт на обслуживании</h1>
        <p>Мы проводим технические работы на сайте. Пожалуйста, введите пароль для доступа к сайту.</p>
        <div class="error">Неверный пароль. Попробуйте снова.</div>
        <form action="/_maintenance-login?redirect=${encodeURIComponent(urlPath)}" method="POST">
          <input type="password" name="password" placeholder="Введите пароль" required autofocus>
          <button type="submit">Разблокировать сайт</button>
        </form>
      </div>
    </body>
    </html>
  `,
    {
      status: 401,
      headers: { "Content-Type": "text/html" },
    },
  );
}

export const onRequest = defineMiddleware(async (context, next) => {
  // Quick toggle to disable maintenance mode
  if (import.meta.env.ENABLE_MAINTENANCE_MODE === "false") {
    return next();
  }

  const url = new URL(context.request.url);

  // Handle login request
  if (
    context.request.method === "POST" &&
    url.pathname === "/_maintenance-login"
  ) {
    const formData = await context.request.formData();
    const password = formData.get("password");
    const redirectPath = url.searchParams.get("redirect") || "/";

    if (password === PASSWORD) {
      context.cookies.set("site_access", "granted", {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      return context.redirect(redirectPath);
    } else {
      // Wrong password
      return renderMaintenancePage(redirectPath, true);
    }
  }

  // Check auth
  if (context.cookies.get("site_access")?.value === "granted") {
    return next();
  }

  // Allow static assets, images, Vite HMR, and Astro internals
  if (
    url.pathname.startsWith("/_astro/") ||
    url.pathname.startsWith("/src/") ||
    url.pathname.startsWith("/@") ||
    url.pathname.startsWith("/node_modules/") ||
    url.pathname.match(
      /\.(png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|css|js|ico)$/,
    )
  ) {
    return next();
  }

  // Render maintenance page for all other requests
  return renderMaintenancePage(url.pathname, false);
});
