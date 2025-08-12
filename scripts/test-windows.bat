@echo off
echo 🖥️  Testing RPI 5Inch Showcase on Windows...
echo.

echo 📋 Checking current setup...
echo.

echo 🔍 Checking if http-server is installed...
npx http-server --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ http-server not found. Installing...
    npm install -g http-server
) else (
    echo ✅ http-server is available
)

echo.
echo 🚀 Starting server with no caching (guaranteed fresh)...
echo 🌐 Server will be available at: http://localhost:3000
echo 🔄 Press Ctrl+C to stop the server
echo.

REM Start server with no caching
npx http-server public -p 3000 -c-1 --cors

echo.
echo ✅ Test completed!
echo 💡 Check your browser at http://localhost:3000
echo 🔧 For development with proper caching: npm run dev
