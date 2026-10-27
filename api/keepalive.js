// Daily keep-alive for the GOCOS Supabase database.
// Supabase free projects pause after about 7 days without activity.
// A Vercel cron job (see vercel.json) calls this once a day and runs a
// tiny read query so the project stays active.
export default async function handler(req, res) {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    return res.status(500).json({ ok: false, error: 'Supabase env vars missing' })
  }
  try {
    const r = await fetch(`${url}/rest/v1/pfas_ocean?select=*&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok, status: r.status, checkedAt: new Date().toISOString() })
  } catch (e) {
    return res.status(502).json({ ok: false, error: String(e) })
  }
}
