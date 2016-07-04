#include <iostream>
#include <samchon/protocol/WebServer.hpp>
#include <samchon/protocol/WebClientDriver.hpp>
#include <samchon/protocol/WebServerConnector.hpp>

#include <thread>

#ifdef _DEBUG
#	pragma comment(lib, "x64/Debug/SamchonFramework.lib")
#else
#	pragma comment(lib, "x64/Release/SamchonFramework.lib")
#endif

namespace samchon
{
namespace example
{
namespace websocket
{
	class MyWebClient : public protocol::IProtocol
	{
	private:
		std::shared_ptr<protocol::ClientDriver> driver;

	public:
		MyWebClient(std::shared_ptr<protocol::ClientDriver> driver)
		{
			this->driver = driver;
			driver->listen(this);
		};

		void sendData(std::shared_ptr<protocol::Invoke> invoke)
		{
			driver->sendData(invoke);
		};
		void replyData(std::shared_ptr<protocol::Invoke> invoke)
		{
			std::cout << "Server got a message" << std::endl;
			std::cout << invoke->toXML()->toString() << std::endl;
			sendData(invoke);
		};
	};

	class MyWebServer : protected protocol::WebServer
	{
	private:
		typedef protocol::Server super;

	public:
		MyWebServer() : super()
		{
			open(11711);
		};

	protected:
		virtual void addClient(std::shared_ptr<protocol::ClientDriver> driver)
		{
			std::cout << "A client has connected." << std::endl;

			try
			{
				new MyWebClient(driver);
			}
			catch (...)
			{

			}
		};
	};

	class MyWebConnector : public protocol::IProtocol
	{
	private:
		std::unique_ptr<protocol::WebServerConnector> connector;

	public:
		MyWebConnector::MyWebConnector()
		{
			connector.reset(new protocol::WebServerConnector());
			connector->connect("127.0.0.1", 11711, "my_path");
			
			std::cout << "succeeded to connect." << std::endl;
			connector->sendData(std::make_shared<protocol::Invoke>("sendMessage", 99999, "I am a C++ Client", 3, 7));
			connector->listen(this);
		};

		void sendData(std::shared_ptr<protocol::Invoke> invoke)
		{
			connector->sendData(invoke);
		};
		void replyData(std::shared_ptr<protocol::Invoke> invoke)
		{
			std::cout << "Client got a message" << std::endl;
			std::cout << invoke->toXML()->toString() << std::endl;
		};
	};
};
};
};

void main()
{
	std::thread t1([] {samchon::example::websocket::MyWebServer server; });
	std::thread t2([] 
		{
			std::this_thread::sleep_for(std::chrono::seconds(1));
			samchon::example::websocket::MyWebConnector connector; 
		});

	t1.join();
	t2.detach();

	system("pause");
}