@echo off
REM Publish script for GitHub Package Registry
REM Usage: scripts\publish.bat [version]

set VERSION=%1

if "%VERSION%"=="" (
    set /p VERSION="Enter version (e.g., 1.0.0): "
)

echo Publishing version %VERSION%...

REM Update package.json version without creating a git tag/commit
call npm pkg set version=%VERSION%
IF ERRORLEVEL 1 goto :fail

REM Commit version bump and tag (if in a git repo)
IF exist .git (
  call git add -A
  call git commit -m "chore(release): v%VERSION%"
  IF ERRORLEVEL 1 echo Warning: git commit failed (continuing)
  call git tag v%VERSION%
  IF ERRORLEVEL 1 echo Warning: git tag failed (continuing)
)

REM Build the package
call npm run build
IF ERRORLEVEL 1 goto :fail

REM Run tests
call npm test --passWithNoTests
IF ERRORLEVEL 1 goto :fail

REM Publish to GitHub Package Registry
call npm publish
IF ERRORLEVEL 1 goto :fail

echo Successfully published @E-Commerce-SaaS-Platform/auth-module@%VERSION%
echo To install in other projects:
echo yarn add @E-Commerce-SaaS-Platform/auth-module
goto :eof

:fail
echo Publish failed with exit code %ERRORLEVEL%
exit /b %ERRORLEVEL%
