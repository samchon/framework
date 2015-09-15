#include <samchon/protocol/ServerConnector.hpp>

#include <boost/asio.hpp>
#include <thread>

using namespace samchon;
using namespace samchon::protocol;

using namespace std;
using namespace boost;
using namespace boost::asio;
using namespace boost::asio::ip;

auto ServerConnector::MY_IP() const -> std::string
{
	return "";
}

ServerConnector::ServerConnector()
	: super()
{
	ioService = nullptr;
	endPoint = nullptr;
	localEndPoint = nullptr;
}
ServerConnector::~ServerConnector()
{
	delete ioService;
	delete endPoint;
	delete localEndPoint;
}

void ServerConnector::connect()
{
	std::string &ip = IP();
	std::string &myIP = MY_IP();

	if (super::socket != nullptr && super::socket->is_open() == true)
		return;

	ioService = new io_service();
	super::socket = new tcp::socket(*ioService, tcp::v4());
	endPoint = new tcp::endpoint(address::from_string(string(ip.begin(), ip.end())), PORT());
	
	if (MY_IP().empty() == false && localEndPoint == nullptr)
	{
		localEndPoint = new tcp::endpoint(address::from_string(string(myIP.begin(), myIP.end())), NULL);
		super::socket->bind(*localEndPoint);
	}

	super::socket->connect(*endPoint);
	thread(&ServerConnector::listen, this).detach();
}