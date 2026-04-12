@echo off
title Orbis — Sync Tasks to Dashboard
color 0A

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║   Orbis — Sync Obsidian to Dashboard     ║
echo  ╚══════════════════════════════════════════╝
echo.

:: Step 1: Run Python sync to regenerate tasks.json
echo  [1/3] Running Obsidian sync...
cd /d "%~dp0.."
python sync_obsidian.py
if %ERRORLEVEL% neq 0 (
    echo  ERROR: sync_obsidian.py failed. Check Python is installed.
    pause
    exit /b 1
)

:: Step 2: Stage the updated tasks.json
echo.
echo  [2/3] Staging tasks.json...
cd /d "%~dp0"
git add data/tasks.json

:: Step 3: Commit and push
echo  [3/3] Pushing to GitHub...
git commit -m "sync: update tasks from Obsidian"
git push

if %ERRORLEVEL%==0 (
    echo.
    echo  ========================================
    echo  Done! Dashboard will update in ~30s.
    echo  Visit: orbis.sam0sa.me
    echo  ========================================
) else (
    echo.
    echo  Push failed. You may need to authenticate.
    echo  Run: git push
    echo  And enter your GitHub credentials.
)

echo.
pause
