call "%VS140COMNTOOLS%\VsDevCmd.bat"

:: ---------------------------------------------------------------------------------
::	Clean C++ Projects
:: ---------------------------------------------------------------------------------
:: X64
MSBuild cpp\SamchonFramework.sln /property:Configuration=Debug /m /property:Platform=x86 /t:Clean
MSBuild cpp\SamchonFramework.sln /property:Configuration=Release /m /property:Platform=x86 /t:Clean

:: X86
MSBuild cpp\SamchonFramework.sln /property:Configuration=Debug /m /property:Platform=x64 /t:Clean
MSBuild cpp\SamchonFramework.sln /property:Configuration=Release /m /property:Platform=x64 /t:Clean

:: BUILTS
for /d /r . %%d in (Debug Release x64) do @if exist "%%d" echo "%%d" && rd /s/q "%%d"