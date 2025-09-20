@echo off
REM Publish script for GitHub Package Registry
REM Usage: scripts\publish.bat [version]

set VERSION=%1

if "%VERSION%"=="" (
    set /p VERSION="Enter version (e.g., 1.0.0): "
)

echo Publishing version %VERSION%...

REM Update package.json version
npm version %VERSION% --no-git-tag-version

REM Build the package
npm run build

REM Run tests
npm test

REM Publish to GitHub Package Registry
npm publish

echo Successfully published @E-Commerce-SaaS-Platform/auth-module@%VERSION%
echo To install in other projects:
echo yarn add @E-Commerce-SaaS-Platform/auth-module
