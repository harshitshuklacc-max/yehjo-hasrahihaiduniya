@echo off
set PATH=%~dp0.tools\node;%PATH%
cd /d "%~dp0"

echo Smart Step Academy - Database setup
if not exist node_modules call npm install
if not exist .env copy /Y .env.example .env >nul

call npx prisma db push
call npm run db:seed
call npx tsx scripts/test-admin-login.ts

echo.
echo Done. Admin: Smartstep05618 / SmartTed*#1
pause
