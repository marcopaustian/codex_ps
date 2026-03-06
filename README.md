# Supabase Shadcn Vercel Starter

Starter-Projekt mit `Next.js 16`, `shadcn/ui`, `Supabase`, `Vercel` und einer
VS-Code-Basis.

## Lokal starten

```bash
npm install
copy .env.example .env.local
npm run dev
```

## Empfohlene Logins

```bash
gh auth login
vercel login
npx supabase login
```

## Enthalten

- `src/lib/supabase/client.ts` fuer Browser-Zugriffe
- `src/lib/supabase/server.ts` fuer Server Components
- `src/lib/supabase/middleware.ts` fuer Session-Refresh
- `.vscode/extensions.json` mit sinnvollen Empfehlungen
- `.env.example` fuer lokale und Vercel-Umgebungsvariablen
