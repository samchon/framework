#include <iostream>
#include <samchon/examples/console_chat_server/ChatServer.hpp>

#pragma comment(lib, "Debug/SamchonFramework.lib")

using namespace samchon::examples::console_chat_server;

void main()
{
	ChatServer chatServer;
	chatServer.open();

	system("pause");
}