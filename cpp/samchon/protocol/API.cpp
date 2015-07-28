#ifdef _WIN64
#	ifdef _DEBUG
#		pragma comment(lib, "../x64/Debug/SamchonLibrary.lib")
#	else
#		pragma comment(lib, "../x64/Release/SamchonLibrary.lib")
#	endif
#else
#	ifdef _DEBUG
#		pragma comment(lib, "../Debug/SamchonLibrary.lib")
#	else
#		pragma comment(lib, "../Release/SamchonLibrary.lib")
#	endif
#endif