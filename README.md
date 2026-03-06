# Baytomat Flowboard

Baytomat Flowboard ist eine produktionsreife Arbeitsplattform auf `Next.js 16`,
`Supabase`, `shadcn/ui`, `Vercel` und `GitHub`.

## Kernfunktionen

- Magic-Link-Login mit Supabase Auth
- Rollenmodell mit `member` und `admin`
- Planner-Board mit `backlog`, `in_progress`, `review` und `done`
- Projekte, Tasks, Kommentare und Attachment-Einträge
- Projektmitglieder und Activity-Log
- Geschuetztes Dashboard und Projekt-Detailseiten

## Lokal starten

```bash
npm install
copy .env.example .env.local
npm run dev
```

## Deployment

- GitHub: `https://github.com/marcopaustian/codex_ps`
- Vercel: `https://supabase-shadcn-vercel-app.vercel.app`

## Datenmodell

- `profiles`
- `projects`
- `project_members`
- `tasks`
- `task_comments`
- `task_attachments`
- `project_activity`

## Hinweis

Echte Datei-Binary-Uploads koennen als naechster Schritt ueber Supabase Storage
ergaenzt werden. Aktuell speichert Baytomat Flowboard Attachment-Metadaten und URLs.
