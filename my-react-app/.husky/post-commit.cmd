@echo off
REM Получаем сообщение последнего коммита
for /f "delims=" %%i in ('git log -1 --pretty=%%B') do set COMMIT_MSG=%%i

REM Запускаем генерацию обновлений
node generateUpdates.cjs "%COMMIT_MSG%"

REM Добавляем src/updates.jsx в индекс
git add src/updates.jsx
