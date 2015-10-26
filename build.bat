call "%VS140COMNTOOLS%\VsDevCmd.bat"

:: ---------------------------------------------------------------------------------
::	Build C++ Projects
:: ---------------------------------------------------------------------------------
MSBuild cpp\SamchonFramework.sln /property:Configuration=Debug /property:Platform=x86 /target:SamchonFramework
MSBuild cpp\SamchonFramework.sln /property:Configuration=Release /property:Platform=x86 /target:SamchonFramework

MSBuild cpp\SamchonFramework.sln /property:Configuration=Debug /property:Platform=x64 /target:SamchonFramework
MSBuild cpp\SamchonFramework.sln /property:Configuration=Release /property:Platform=x64 /target:SamchonFramework

:: ---------------------------------------------------------------------------------
::	Build JS Projects
:: ---------------------------------------------------------------------------------
::TYPE_SCRIPT
MSBuild js\SamchonFrameworkJS.sln

::FLEX -> DON't KNOW HOW TO BUILD SWC BY COMMAND LINE