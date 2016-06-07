#include <iostream>
#include <thread>
#include <string>
#include <samchon/protocol/IWebServer.hpp>
#include <samchon/protocol/IWebClient.hpp>
#include <samchon/protocol/Invoke.hpp>

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
using namespace samchon::library;
using namespace samchon::protocol;

class WebClient
	: public IWebClient
{
private:
	typedef IWebClient super;

public:
	WebClient(Socket *socket)
		: super()
	{
		this->socket = socket;

		cout << "A client has connected." << endl;
	};

	virtual void replyData(shared_ptr<Invoke> invoke) override
	{
		cout << "Got a message: " << endl;
		cout << invoke->toXML()->toString() << endl;

		size_t size = invoke->at(0)->getValue<size_t>();
		sendData(make_shared<Invoke>("meesage from cpp", string(size, 'A')));
	};
};

class WebServer
	: public IWebServer
{
private:
	typedef IWebServer super;

public:
	WebServer()
		: super()
	{
	};

protected:
	virtual auto PORT() const -> int override
	{
		return 37888;
	};
	
	virtual void addClient(Socket *socket, const string &path, const string &sessionID) override
	{
		unique_ptr<WebClient> client(new WebClient(socket));
		client->listen();
	};
};

void main()
{
	WebServer server;
	server.open();

	system("pause");
}