@echo off
set PATH=%~dp0.tools\node;%PATH%
cd /d "%~dp0"

echo Smart Step Academy - Starting...

if not exist node_modules call npm install

if not exist .env (
  echo Creating .env...
  copy /Y .env.example .env >nul
)

if not exist prisma\dev.db (
  call npx prisma db push
  call npx tsx prisma/seed.ts
)

start http://localhost:3000
call npm run dev
