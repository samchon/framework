#ifdef _WIN64
#	ifdef _DEBUG
#		pragma comment(lib, "../x64/Debug/SamchonLibrary.lib")
#		pragma comment(lib, "../x64/Debug/SamchonProtocol.lib")
#	else
#		pragma comment(lib, "../x64/Release/SamchonLibrary.lib")
#		pragma comment(lib, "../x64/Release/SamchonProtocol.lib")
#	endif
#else
#	ifdef _DEBUG
#		pragma comment(lib, "../Debug/SamchonLibrary.lib")
#		pragma comment(lib, "../Debug/SamchonProtocol.lib")
#	else
#		pragma comment(lib, "../Release/SamchonLibrary.lib")
#		pragma comment(lib, "../Release/SamchonProtocol.lib")
#	endif
#endif