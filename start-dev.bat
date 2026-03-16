@echo off
echo Starting Sensei Services...

echo.
echo Starting Backend...
start cmd /k "cd Backend && npm run dev"

echo.
echo Starting Frontend...
start cmd /k "cd Frontend && npm run dev"

echo.
echo Starting AI Service...
start cmd /k "cd AI-Service && venv\Scripts\activate && uvicorn app.main:app --reload"

echo.
echo All services started!
pause