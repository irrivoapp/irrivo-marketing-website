import "jsr:@supabase/functions-js/edge-runtime.d.ts";
declare const Deno: { env: { get(name: string): string | undefined }; serve(handler: (request: Request) => Response | Promise<Response>): void };

const allowedOrigins = new Set(["https://irrivo.com", "https://www.irrivo.com"]);
const cors = (origin: string) => ({
  "Access-Control-Allow-Origin": allowedOrigins.has(origin) ? origin : "https://irrivo.com",
  "Access-Control-Allow-Headers": "content-type, accept",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
});
const json = (origin: string, body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...cors(origin), "Content-Type": "application/json", "Cache-Control": "no-store" },
});
const clean = (value: FormDataEntryValue | null, limit: number) => String(value ?? "").trim().slice(0, limit);
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]!));

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin") ?? "";
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (request.method !== "POST") return json(origin, { error: "Method not allowed" }, 405);
  if (!allowedOrigins.has(origin)) return json(origin, { error: "Invalid origin" }, 403);

  try {
    const form = await request.formData();
    if (clean(form.get("website"), 200)) return json(origin, { received: true });
    const fields = {
      name: clean(form.get("name"), 100), email: clean(form.get("email"), 254),
      organization: clean(form.get("organization"), 120), jobTitle: clean(form.get("jobTitle"), 100),
      size: clean(form.get("size"), 30), industry: clean(form.get("industry"), 60),
      country: clean(form.get("country"), 100), phone: clean(form.get("phone"), 40),
      requestType: clean(form.get("requestType"), 40), message: clean(form.get("message"), 3000),
    };
    if (!fields.name || !fields.organization || !fields.jobTitle || !fields.size || !fields.industry || !fields.country || !fields.requestType || fields.message.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      return json(origin, { error: "Please complete all required fields." }, 400);
    }
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) return json(origin, { error: "Email delivery is not configured." }, 503);
    const rows = Object.entries(fields).map(([key, value]) => `<tr><th style="text-align:left;padding:8px;border-bottom:1px solid #eee">${escapeHtml(key)}</th><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(value).replaceAll("\n", "<br>")}</td></tr>`).join("");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "IRRIVO Website <accounts@irrivo.com>", to: ["irrivoapp@gmail.com"], reply_to: fields.email, subject: `IRRIVO website: ${fields.requestType} — ${fields.name}`, html: `<h2>New IRRIVO website request</h2><table style="border-collapse:collapse">${rows}</table>` }),
    });
    if (!response.ok) { console.error("Resend delivery failed", response.status, await response.text()); return json(origin, { error: "Email delivery failed." }, 502); }
    return json(origin, { received: true });
  } catch (error) {
    console.error("Website contact failed", String(error));
    return json(origin, { error: "Request could not be processed." }, 400);
  }
});
