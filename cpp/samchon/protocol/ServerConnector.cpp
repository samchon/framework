#include <samchon/protocol/ServerConnector.hpp>

#include <boost/asio.hpp>
#include <thread>

using namespace std;
using namespace samchon;
using namespace samchon::protocol;

ServerConnector::ServerConnector()
	: Communicator()
{
}
ServerConnector::~ServerConnector()
{
}

void ServerConnector::connect(const string &ip, int port)
{
	if (socket != nullptr && socket->is_open() == true)
		return;

	io_service.reset(new boost::asio::io_service());
	endpoint.reset(new boost::asio::ip::tcp::endpoint(boost::asio::ip::address::from_string(ip), port));

	socket.reset(new boost::asio::ip::tcp::socket(*io_service, boost::asio::ip::tcp::v4()));
	socket->connect(*endpoint);
}