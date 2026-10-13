<# : batch portion
@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Batch Script
@REM ----------------------------------------------------------------------------

@IF "%DEBUG%" == "" @ECHO OFF
@SETLOCAL

set ERROR_CODE=0

@REM Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" @setlocal

@REM ==== START VALIDATION ====
if not "%JAVA_HOME%" == "" goto OkJHome

for %%i in (java.exe) do set "JAVACMD=%%~$PATH:i"
goto checkJCmd

:OkJHome
set "JAVACMD=%JAVA_HOME%\bin\java.exe"

:checkJCmd
if exist "%JAVACMD%" goto chkMvnHome

echo.
echo Error: JAVA_HOME is not defined correctly.
echo We cannot execute %JAVACMD%
echo.
goto error

:chkMvnHome
set "DIRNAME=%~dp0"
if "%DIRNAME%" == "" set "DIRNAME=."
set "APP_BASE_NAME=%~n0"
set "APP_HOME=%DIRNAME%"

@REM Resolve .mvn directory
set "WRAPPER_JAR=%APP_HOME%\.mvn\wrapper\maven-wrapper.jar"
set "WRAPPER_PROPERTIES=%APP_HOME%\.mvn\wrapper\maven-wrapper.properties"

if exist "%WRAPPER_JAR%" goto runWrapper

powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $wc = New-Object System.Net.WebClient; $wc.DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar', '%WRAPPER_JAR%') }"

:runWrapper
"%JAVACMD%" -Dfile.encoding=UTF-8 -jar "%WRAPPER_JAR%" %*
if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%
exit /B %ERROR_CODE%
#>
