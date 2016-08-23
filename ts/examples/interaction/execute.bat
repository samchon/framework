:: REPORTER
start cmd /k "color F0 & node reporter"

:::::::::::::::::::::::::::::::::
:: TSP SYSTEMS
:::::::::::::::::::::::::::::::::
start cmd /k "color 1F & node tsp-master" & timeout 1
	start cmd /k "color 9F & node tsp-slave 127.0.0.1"
	start cmd /k "color 9F & node tsp-slave 127.0.0.1"

:::::::::::::::::::::::::::::::::
:: PACKER SYSTEMS
:::::::::::::::::::::::::::::::::
start cmd /k "color 2F & node packer-master" & timeout 1
	start cmd /k "color 6F & node packer-mediator 127.0.0.1" & timeout 1
		start cmd /k "color A0 & node packer-slave 127.0.0.1 37350"
		start cmd /k "color A0 & node packer-slave 127.0.0.1 37350"
	start cmd /k "color A0 & node packer-slave 127.0.0.1 37300"
	start cmd /k "color A0 & node packer-slave 127.0.0.1 37300"

:: CHIEF
start cmd /k "color 0F & node chief 127.0.0.1 127.0.0.1 127.0.0.1"