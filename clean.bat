call "%VS140COMNTOOLS%\VsDevCmd.bat"

:: ---------------------------------------------------------------------------------
::	Clean C++ Projects
:: ---------------------------------------------------------------------------------
MSBuild cpp\SamchonFramework.sln /property:Configuration=Debug /m /property:Platform=x86 /t:Clean
MSBuild cpp\SamchonFramework.sln /property:Configuration=Release /m /property:Platform=x86 /t:Clean

MSBuild cpp\SamchonFramework.sln /property:Configuration=Debug /m /property:Platform=x64 /t:Clean
MSBuild cpp\SamchonFramework.sln /property:Configuration=Release /m /property:Platform=x64 /t:Clean