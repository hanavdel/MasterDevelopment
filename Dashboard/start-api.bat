@echo off
cd /d "%~dp0.."
set PORT=3283
echo Master Dev Dashboard API on http://127.0.0.1:%PORT%/api/dashboard/snapshot
echo (IIS statik UI 3282 + bu API 3283)
node server.js
