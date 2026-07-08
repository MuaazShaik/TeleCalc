@echo off
setlocal enabledelayedexpansion

echo =============================================
echo   TeleCalc - Telecom Call Charge Calculator
echo =============================================
echo.

:: 1. Check Java
where java >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [TeleCalc] ERROR: Java not found. Install JDK 17+ from https://adoptium.net
    pause
    exit /b 1
)

:: 2. Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [TeleCalc] ERROR: Node.js not found. Install from https://nodejs.org
    pause
    exit /b 1
)

:: 3. Start Spring Boot backend
echo [TeleCalc] Starting backend on port 8080...
cd backend
if not exist "mvnw.cmd" (
    echo [TeleCalc] Generating Maven wrapper...
    call mvn wrapper:wrapper -Dmaven=3.9.9 2>nul
    if not exist "mvnw.cmd" (
        echo [TeleCalc] Maven wrapper not available. Trying direct mvn...
        start /b cmd /c "mvn spring-boot:run"
        goto :frontend
    )
)
start /b cmd /c "mvnw.cmd spring-boot:run"

:frontend
cd ..

:: 4. Install frontend dependencies
echo [TeleCalc] Setting up frontend...
cd frontend
if not exist "node_modules\" (
    echo [TeleCalc] Installing Node.js dependencies...
    call npm install
)

:: 5. Start Vite dev server
echo [TeleCalc] Starting frontend on port 5173...
echo.
echo =============================================
echo   Backend:  http://localhost:8080
echo   Frontend: http://localhost:5173
echo =============================================
echo.
call npm run dev
