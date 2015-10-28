SET RELEASE_DIR=D:\Homepage\samchon.github.io\framework\design\

:: ---------------------------------------------------------
::    COPY DOCUMENTS
:: ---------------------------------------------------------
IF EXIST "%RELEASE_DIR%" rd "%RELEASE_DIR%" /S /Q

xcopy *.pdf "%RELEASE_DIR%" /s /Y

:: ----------------------------------------------------------------
::    COMMIT TO GITHUB (SAMCHON.GITHUB.IO)
:: ----------------------------------------------------------------
::cd "%RELEASE_DIR%..\.."
::call release.bat