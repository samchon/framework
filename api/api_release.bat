SET RELEASE_DIR=D:\Homepage\samchon.github.io\framework\api\

:: ----------------------------------------------------------------
::    C++ API DOCUMENT
:: ----------------------------------------------------------------
::PATH
SET DOXYGEN_DIR=C:\Program Files\doxygen\bin\
SET CHM_DIR=C:\Program Files (x86)\HTML Help Workshop\

::CLEAR
IF EXIST "%RELEASE_DIR%cpp" rd "%RELEASE_DIR%cpp" /S /Q

::DOCUMENTATE
"%DOXYGEN_DIR%doxygen" cpp.doxygen
call "%RELEASE_DIR%_cpp/latex/make.bat"
"%CHM_DIR%hhc.exe" "%RELEASE_DIR%_cpp\html\index.hhp"

::MOVE
move "%RELEASE_DIR%_cpp\html\index.chm" "%RELEASE_DIR%_cpp\html\api.chm"
move "%RELEASE_DIR%_cpp\latex\refman.pdf" "%RELEASE_DIR%_cpp\html\api.pdf"
move "%RELEASE_DIR%_cpp\html" "%RELEASE_DIR%cpp"

::TRUNCATE DREGS
rd "%RELEASE_DIR%_cpp" /S /Q

:: ----------------------------------------------------------------
::    FLEX API DOCUMENT
:: ----------------------------------------------------------------
::PATH
SET ASDOC_DIR=E:\Downloads\Programming\Flex\sdks\4.6.0\bin\
SET FLEX_SRC_DIR=..\flex\src\

::CLEAR
IF EXIST "%RELEASE_DIR%flex" rd "%RELEASE_DIR%flex" /S /Q

::DOCUMENTATE
"%ASDOC_DIR%asdoc" -source-path %FLEX_SRC_DIR% -doc-sources %FLEX_SRC_DIR% -output "%RELEASE_DIR%flex"

:: ----------------------------------------------------------------
::    TYPE_SCRIPT API DOCUMENT
:: ----------------------------------------------------------------
::PATH
SET NPM_DIR=C:\Users\samch\AppData\Roaming\npm\
SET TS_SRC_DIR=../js/

::CLEAR
IF EXIST "%RELEASE_DIR%ts" rd "%RELEASE_DIR%ts" /S /Q

::DOCUMENTATE
"%NPM_DIR%typedoc" --target ES5 --out "%RELEASE_DIR%ts" "%TS_SRC_DIR%SamchonFramework.ts"

:: ----------------------------------------------------------------
::    COMMIT TO GITHUB (SAMCHON.GITHUB.IO)
:: ----------------------------------------------------------------
cd "%RELEASE_DIR%..\.."
call release.bat