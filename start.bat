@echo off
set PATH=%~dp0.tools\node;%PATH%
cd /d "%~dp0"

echo Smart Step Academy - Starting...

if not exist node_modules call npm install

if not exist .env (
  echo Creating .env...
  copy /Y .env.example .env >nul
  echo.
  echo Add Neon PostgreSQL URLs to .env for local run, or deploy on Vercel - see VERCEL-DEPLOY.md
  echo.
)

echo Setting up database...
call npx prisma db push
if errorlevel 1 (
  echo Database setup failed. Check Node.js and run: npm install
  pause
  exit /b 1
)
call npm run db:seed
if errorlevel 1 (
  echo Database seed failed.
  pause
  exit /b 1
)

start http://localhost:3000
call npm run dev
