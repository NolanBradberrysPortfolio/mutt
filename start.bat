@echo off
echo ==========================================
echo   MUTT - Variety Broken Attention Span Arcade
echo   Starting local server on port 8000...
echo   Open http://localhost:8000 in your browser
echo ==========================================
echo.
python -m http.server 8000
pause
