#include <samchon/protocol/ServerConnector.hpp>

#include <boost/asio.hpp>
#include <thread>

using namespace samchon;
using namespace samchon::protocol;

using namespace std;
using namespace boost;
using namespace boost::asio;
using namespace boost::asio::ip;

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

auto ServerConnector::getMyIP() const -> std::string
{
	return "";
}

void ServerConnector::connect()
{
	std::string &ip = getIP();
	std::string &myIP = getMyIP();

	if (super::socket != nullptr && super::socket->is_open() == true)
		return;

	ioService = new io_service();
	super::socket = new tcp::socket(*ioService, tcp::v4());
	endPoint = new tcp::endpoint(address::from_string(ip), getPort());
	
	if (getMyIP().empty() == false && localEndPoint == nullptr)
	{
		localEndPoint = new tcp::endpoint(address::from_string(myIP), NULL);
		super::socket->bind(*localEndPoint);
	}

	super::socket->connect(*endPoint);
	super::listen();
	//thread(&ServerConnector::listen, this).detach();
}