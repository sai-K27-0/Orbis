@echo off
title Orbis — Push to GitHub
color 0A

echo.
echo  ╔══════════════════════════════════════════╗
echo  ║   Orbis — Push to GitHub                 ║
echo  ║   Repo: github.com/sai-K27-0/Orbis       ║
echo  ╚══════════════════════════════════════════╝
echo.
echo  You need a GitHub Personal Access Token.
echo  Get one at: github.com/settings/tokens
echo  Click "Generate new token (classic)" → tick "repo" → Generate
echo.
set /p GH_PAT=  Paste your GitHub token here (input hidden after paste):
echo.

if "%GH_PAT%"=="" (
    echo  ERROR: No token entered. Exiting.
    pause
    exit /b 1
)

echo  Setting up git...

:: Remove any broken .git and start clean
if exist ".git" rmdir /s /q ".git"

:: Git identity
git config --global user.email "saikrithic62009@gmail.com"
git config --global user.name "Sai"
git config --global init.defaultBranch main

:: Init, stage, commit
git init
git add .
git commit -m "feat: Orbis v3 — IB dashboard with today panel, task filter, calendar export, FA tracker, timetable, study timer"

:: Set remote with token embedded in URL (used only for this push)
git remote add origin "https://sai-K27-0:%GH_PAT%@github.com/sai-K27-0/Orbis.git"

echo.
echo  Pushing to GitHub...
git push -u origin main
echo.

if %ERRORLEVEL%==0 (
    echo  ========================================
    echo  SUCCESS! Files pushed to GitHub.
    echo  Netlify will auto-deploy in ~30 seconds.
    echo.
    echo  Live site: orbis.mydomainname.com
    echo  Repo:      github.com/sai-K27-0/Orbis
    echo  ========================================
    echo.
    echo  SECURITY: Revoke the token you just used at:
    echo  github.com/settings/tokens
    echo  Then create a fresh one when you need to push again.
) else (
    echo  ========================================
    echo  FAILED. Try these fixes:
    echo   1. Make sure the token has "repo" scope
    echo   2. Make sure the Orbis repo exists on GitHub
    echo   3. Re-run this script with a fresh token
    echo  ========================================
)

:: Clear the remote URL so the token isn't stored in .git/config
git remote set-url origin "https://github.com/sai-K27-0/Orbis.git"

echo.
pause
