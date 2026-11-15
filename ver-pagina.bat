@echo off
rem Doble clic en este archivo para ver la pagina en tu computador.
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js. Instalalo desde https://nodejs.org y vuelve a intentarlo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Preparando todo por primera vez. Puede tardar un par de minutos...
  call npm install
)

echo.
echo  La pagina se abrira en tu navegador en unos segundos.
echo  Direccion: http://localhost:8080
echo  Para detenerla, cierra esta ventana.
echo.

start "" cmd /c "timeout /t 5 >nul & start http://localhost:8080"
call npm start
pause
