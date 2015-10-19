SET CHM_DIR=C:\Program Files (x86)\HTML Help Workshop

doxygen cpp.doxygen
call cpp/latex/make.bat
"%CHM_DIR%\hhc.exe" cpp\html\index.hhp

move cpp\html\index.chm cpp\index.chm