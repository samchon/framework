:::::::::::::::::::::::::::::::::
:: MONITOR AND CHIEF SYSTEM
:::::::::::::::::::::::::::::::::
:: MONITOR
start cmd /k "color F0 & node monitor" & timeout 1

:: CHIEF
start cmd /k "color 0F & node chief" & timeout 1

:::::::::::::::::::::::::::::::::
:: TSP SYSTEMS
:::::::::::::::::::::::::::::::::
start cmd /k "color 1F & node tsp-master" & timeout 1
	start cmd /k "color 9F & node tsp-slave"
	start cmd /k "color 9F & node tsp-slave"

:::::::::::::::::::::::::::::::::
:: PACKER SYSTEMS
:::::::::::::::::::::::::::::::::
start cmd /k "color 2F & node packer-master" & timeout 1
	start cmd /k "color 6F & node packer-mediator" & timeout 1
		start cmd /k "color A0 & node packer-slave 2"
		start cmd /k "color A0 & node packer-slave 2"
		start cmd /k "color A0 & node packer-slave 2"
		start cmd /k "color A0 & node packer-slave 2"
	start cmd /k "color A0 & node packer-slave 1"
	start cmd /k "color A0 & node packer-slave 1"