# Smart Recruit AI Frontend

React + Vite + Tauri frontend for Smart Recruit AI.

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

Local backend default:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Production Web Build

```bash
npm run build
```

Set `VITE_API_BASE_URL` to your deployed backend URL before building for web.

## Tauri Desktop Build

```bash
npm run tauri:build
```

The desktop app now avoids remote fonts, remote icons, and remote images, so the packaged app can run offline after build.

## GitHub Actions

The workflow at `.github/workflows/tauri-windows.yml` builds:

- Windows `.msi`
- Windows setup `.exe`
- Portable `.zip`

On `main`, artifacts appear in the workflow run.
On tags like `v1.0.0`, release assets are attached to the GitHub release.
