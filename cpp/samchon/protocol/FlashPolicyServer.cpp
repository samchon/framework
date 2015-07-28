#include <samchon/protocol/FlashPolicyServer.hpp>

#include <thread>
#include <boost/asio.hpp>
#include <samchon/String.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::protocol;

FlashPolicyServer::FlashPolicyServer() {}

void FlashPolicyServer::openServer()
{
	boost::asio::io_service ioService;
	boost::asio::ip::tcp::endpoint endPoint(boost::asio::ip::tcp::v4(), 843);
	boost::asio::ip::tcp::acceptor acceptor(ioService, endPoint);

	while (true)
	{
		boost::asio::ip::tcp::socket *socket = new boost::asio::ip::tcp::socket(ioService);
		acceptor.accept(*socket);

		thread(&FlashPolicyServer::accept, this, socket).detach();
	}
}
void FlashPolicyServer::accept(void *ptr)
{
	boost::asio::ip::tcp::socket *socket = (boost::asio::ip::tcp::socket *)ptr;

	string data;
	vector<char> piece;
	boost::system::error_code error;

	while (true)
	{
		piece.assign(1000, NULL);
		socket->read_some(boost::asio::buffer(&piece[0], 1000), error);

		string policy = "<?xml version='1.0'?><cross-domain-policy><allow-access-from domain='*' to-ports='*' /></cross-domain-policy>";
		boost::system::error_code error;
		socket->write_some(boost::asio::buffer(policy), error);

		break;
	}
	socket->close();
	delete socket;
}