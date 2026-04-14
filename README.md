# Smart Recruit AI Frontend

React + Vite + Tauri frontend for Smart Recruit AI.

## Local Development

```bash
npm install
npm run dev
```

Use this env for local backend:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Files included:

- `.env.local.example` for local backend
- `.env.web.example` for deployed backend

## Which Build To Use

There are two common frontend builds:

1. Desktop app for local backend

Use:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Then build:

```bash
npm run tauri:build
```

This desktop build will call your local backend on `localhost:8000`.
If you download this app later from GitHub, it will still work as long as your backend is running locally on the same machine.

2. Web build or desktop build for deployed backend

Use:

```env
VITE_API_BASE_URL=https://your-backend-url.choreoapps.dev
```

Then build:

```bash
npm run build
```

Or for a desktop app that talks to the deployed backend:

```bash
npm run tauri:build
```

Important:

- `npm run build` = web frontend build
- `npm run tauri:build` = desktop app build
- both builds use the `VITE_API_BASE_URL` value that exists at build time

## Production Web Build

```bash
npm run build
```

Set `VITE_API_BASE_URL` to your deployed backend URL before building for web.

Example:

```env
VITE_API_BASE_URL=https://your-backend-url.choreoapps.dev
```

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

On `main`, all three files appear in the workflow run artifacts.
On tags like `v1.0.0`, release assets are attached to the GitHub release.
