:: ---------------------------------------------------------
::	FETCH DEPENDENCIES
:: ---------------------------------------------------------
:: DIRECTORIES TO FETCH
SET STD_DIR=D:\OneDrive\Project\Samchon\stl\release

:: DEFINITIONS (TYPESCRIPT HEADER FILE)
xcopy %STD_DIR%\*.d.ts src\std\ /Y

:: INCLUDES (JAVASCRIPT FILE)
xcopy %STD_DIR%\*.js include\ /Y