#include <samchon/protocol/IServerConnector.hpp>

#include <boost/asio.hpp>
#include <thread>

using namespace samchon;
using namespace samchon::protocol;

using namespace std;
using namespace boost;
using namespace boost::asio;
using namespace boost::asio::ip;

auto IServerConnector::MY_IP() const -> String
{
	return _T("");
}

IServerConnector::IServerConnector()
	: super()
{
	ioService = nullptr;
	endPoint = nullptr;
	localEndPoint = nullptr;
}
IServerConnector::~IServerConnector()
{
	delete ioService;
	delete endPoint;
	delete localEndPoint;
}

void IServerConnector::connect()
{
	String &ip = IP();
	String &myIP = MY_IP();

	if (super::socket != nullptr && super::socket->is_open() == true)
		return;

	if(ioService == nullptr)		ioService = new io_service();
	if (super::socket == nullptr)	super::socket = new tcp::socket(*ioService, tcp::v4());

	if (endPoint == nullptr)
		endPoint = new tcp::endpoint(address::from_string(string(ip.begin(), ip.end())), PORT());
	if (MY_IP().empty() == false && localEndPoint == nullptr)
	{
		localEndPoint = new tcp::endpoint(address::from_string(string(myIP.begin(), myIP.end())), NULL);
		super::socket->bind(*localEndPoint);
	}

	super::socket->connect(*endPoint);	
	thread(&IServerConnector::listen, this).detach();
}