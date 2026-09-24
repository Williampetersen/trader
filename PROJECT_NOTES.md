# GPT Chart View – Project Notes

Handoff notes for continuing work on another machine. Last updated: 2026-09-24.

## Set up on a new computer

```bash
git clone https://github.com/Williampetersen/trader.git
cd trader
npm ci
# create .env.local (see "Environment variables" below), then:
npm run dev
```

- There is **no `.env.local` in git** (it is ignored). The real secrets live in **Vercel → Project `trader` → Settings → Environment Variables**. Copy them from there, or install the Vercel CLI and run `npx vercel link` then `npx vercel env pull .env.local`.
- The `trader` entry at the repo root is an empty git submodule link; it can be ignored.

## Deployment

- Vercel project: `williampetersens-projects/trader`, connected to GitHub.
- **Every push to `main` deploys to production automatically.** No CLI needed.
- Check a deploy: the commit's status on GitHub, or the Vercel dashboard.

## Environment variables

See `.env.example` for the full list. The important ones:

| Variable | Purpose |
|---|---|
| `OPENROUTER_API_KEY` | Required. AI chart analysis (uploads fail without it). |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*` | Paid plans via Stripe Checkout. |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_*`) | Durable database on Vercel. Without it data is lost between deploys. |
| `OWNER_EMAIL`, `OWNER_PASSWORD` | Login for the owner dashboard at `/owner/login`. |
| `SMTP_*`, `SUPPORT_*` | Support ticket and OTP emails. |

## What has been done

### 1. Light dashboard redesign (commit `6b233b4`)
- User dashboard (`/dashboard/*`) and owner dashboard (`/owner/*`) switched from dark to a white/light theme in the style of the Material Tailwind dashboard, built with plain Tailwind.
- `@material-tailwind/react` was **deliberately not installed**: its types break `next build` on React 18 + TypeScript.
- Shared layout: `src/components/dashboard/AppFrame.tsx` (floating white sidebar, sticky top bar with breadcrumb, mobile drawer).
- Shared UI kit: `src/components/dashboard/DashboardUi.tsx` (`Panel`, `PanelHeader`, `StatCard`, `StatGrid`, `Badge`, `Notice`, `IconTile`, `Avatar`, button/input/table classes, `toneGradients`). `src/components/owner/OwnerUi.tsx` re-exports these under owner names. Change colors here.
- Font: Roboto (`src/lib/fonts.ts`), applied via the `.app-theme` class.
- Not yet restyled: `/login`, `/signup`, `/owner/login` (still dark).

### 2. Free trial = 3 uploads per account, no time limit (commit `cabd54a`)
- Each account gets **3 free uploads in total, for life**. After that they must buy a plan.
- Stored as `user.trialUploadsUsed` (never resets). Logic: `applyPlanRules` and `isPlanExpired` in `src/lib/server/store.ts`; counter incremented in `src/app/api/analyses/route.ts` only after a successful analysis.
- Existing trial users were migrated from their analysis count.
- A paid plan that expires does **not** bring the trial back.
- Known gaps: someone can sign up again with a new email for 3 more; two uploads at the exact same moment could both succeed (no atomic DB write).

## How the chart analysis works today

- `src/lib/server/ai.ts` sends the uploaded image to OpenRouter model `openai/gpt-4o-mini` with a strict JSON schema, and gets back symbol, timeframe, entry type, entry, SL, TP1, TP2, support, resistance, confidence and risk/reward.
- Weaknesses: small model misreads price-axis numbers; levels are estimated from pixels with no market data; no server-side check that the numbers make sense.
- Uploaded images are written to `/tmp` on Vercel, so they can disappear between deploys. Move them to durable storage (e.g. Vercel Blob) later.

## Next step: real-time analysis (planned, not started)

Recommended approach: **market data calculates the levels; AI only reads the image and explains.**

1. AI reads only the **symbol + timeframe** from the screenshot. Add a symbol/timeframe picker to the upload form as a fallback.
2. Server fetches the last 200–500 real candles:
   - Crypto: Binance API (free, no key).
   - Forex / gold / indices: Twelve Data, OANDA or Polygon.
   - Stocks: Polygon or Alpaca.
3. Code calculates the trade from exact prices: trend (EMA 50/200 + market structure), support/resistance from swing highs/lows, entry, stop-loss beyond the last swing + ATR buffer, TP1/TP2 at the next levels, exact risk/reward, confidence from how many signals agree.
4. A stronger vision model writes the explanation from those numbers.
5. Results page shows a live chart (TradingView `lightweight-charts`) with the entry/SL/TP lines.
6. A background job marks each analysis Won/Lost automatically when TP or SL is hit, so a real win rate can be shown publicly.

Build order:
1. Quick win (~1 day): stronger model + server-side checks (SL on the correct side of entry, exact risk/reward).
2. Market-data engine for the main market (~3–5 days).
3. Live chart + automatic Won/Lost tracking (~2–3 days).

**Open question:** which markets do customers mainly trade (crypto, forex, gold, stocks)? This decides the first data source. If crypto, start with Binance.

Keep the educational disclaimer and never promise results: selling trade signals as advice can fall under financial regulation.
