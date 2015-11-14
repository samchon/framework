#include <iostream>
#include <samchon/examples/console_chat_server/ChatServer.hpp>

#ifdef _WIN64
#	ifdef _DEBUG
#		pragma comment(lib, "x64/Debug/SamchonFramework.lib")
#	else
#		pragma comment(lib, "x64/Release/SamchonFramework.lib")
#	endif
#else
#	ifdef _DEBUG
#		pragma comment(lib, "Debug/SamchonFramework.lib")
#	else
#		pragma comment(lib, "Release/SamchonFramework.lib")
#	endif
#endif

using namespace samchon::example::console_chat_server;

void main()
{
	ChatServer chatServer;
	chatServer.open();

	system("pause");
}