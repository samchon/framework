:: ---------------------------------------------------------------------------------
::	Build Projects
:: ---------------------------------------------------------------------------------
call "%VS140COMNTOOLS%\VsDevCmd.bat"

::MSBuild cpp\SamchonFramework.sln /property:Configuration=Debug /property:Platform=x86 /target:SamchonFramework
::MSBuild cpp\SamchonFramework.sln /property:Configuration=Release /property:Platform=x86 /target:SamchonFramework

::MSBuild cpp\SamchonFramework.sln /property:Configuration=Debug /property:Platform=x64 /target:SamchonFramework
::MSBuild cpp\SamchonFramework.sln /property:Configuration=Release /property:Platform=x64 /target:SamchonFramework

:: ---------------------------------------------------------------------------------
::	Git Commit
:: ---------------------------------------------------------------------------------
git add .
git commit -m "%date% %time%"
git push origin master

pause