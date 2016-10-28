:::::::::::::::::::::::::::::::::
:: MONITOR AND CHIEF SYSTEM
:::::::::::::::::::::::::::::::::
:: MONITOR
start cmd /k "color F0 & node monitor" & timeout 1

:: VIEWER
start cmd /k ..\interaction-viewer\index.html

:: CHIEF
start cmd /k "color 0F & node chief" & timeout 1

:::::::::::::::::::::::::::::::::
:: MASTER SYSTEMS
:::::::::::::::::::::::::::::::::
start cmd /k "color 2F & node master 37101"
start cmd /k "color 2F & node master 37102"
start cmd /k "color 2F & node master 37103" & timeout 1

:::::::::::::::::::::::::::::::::
:: MEDIATOR SYSTEMS - LV.1
:::::::::::::::::::::::::::::::::
start cmd /k "color 6F & node mediator 37102 37201"
start cmd /k "color 6F & node mediator 37102 37202"
start cmd /k "color 6F & node mediator 37103 37203" & timeout 1

:::::::::::::::::::::::::::::::::
:: MEDIATOR SYSTEMS - LV.2
:::::::::::::::::::::::::::::::::
start cmd /k "color 6F & node mediator 37203 37204" & timeout 1

:::::::::::::::::::::::::::::::::
:: SLAVE SYSTEMS
:::::::::::::::::::::::::::::::::
start cmd /k "color A0 & node slave 37101"
start cmd /k "color A0 & node slave 37101"

start cmd /k "color A0 & node slave 37201"
start cmd /k "color A0 & node slave 37201"
start cmd /k "color A0 & node slave 37202"
start cmd /k "color A0 & node slave 37202"

start cmd /k "color A0 & node slave 37103"
::start cmd /k "color A0 & node slave 37103"
start cmd /k "color A0 & node slave 37203"
::start cmd /k "color A0 & node slave 37203"
start cmd /k "color A0 & node slave 37204"
::start cmd /k "color A0 & node slave 37204"