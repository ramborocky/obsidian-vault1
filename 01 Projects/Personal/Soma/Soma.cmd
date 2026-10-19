@echo off
rem Starts the Soma sync hub (if it isn't running already) and opens Soma in the browser.
rem The small hub window shows your PC address and sync code for the phone. Keep it open while you sync.
cd /d "%~dp0"
start "Soma sync hub" /min node "%~dp0sync-server.js" --open
