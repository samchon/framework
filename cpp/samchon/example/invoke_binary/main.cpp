#include <samchon/example/invoke_binary/Server.hpp>
#include <samchon/example/invoke_binary/Client.hpp>

#include <iostream>
#include <array>
#include <thread>

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

using namespace std;
using namespace samchon::example::invoke_binary;

void main()
{
	Server server;
	Client client;

	array<thread, 2> threadArray =
	{
		thread([&server]()
		{
			server.open();
		}),
		thread([&client]()
		{
			client.connect();
			client.listen();
		})
	};

	for (size_t i = 0; i < threadArray.size(); i++)
		threadArray[i].join();
}