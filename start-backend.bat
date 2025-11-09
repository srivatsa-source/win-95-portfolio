@echo off
echo ========================================
echo  Ora Chatbot Backend - Quick Start
echo ========================================
echo.

cd backend

if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo ⚠️  IMPORTANT: Edit backend\.env and add your OpenAI API key!
    echo    Get your API key from: https://platform.openai.com/api-keys
    echo.
    pause
    notepad .env
)

echo.
echo Starting backend server...
echo.
echo 🐱 Ora will be available at: http://localhost:3000/api/chat
echo.
call npm start
