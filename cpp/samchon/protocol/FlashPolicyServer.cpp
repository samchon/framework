#include <samchon/protocol/FlashPolicyServer.hpp>

#include <thread>
#include <boost/asio.hpp>

#include <string>
#include <samchon/library/XML.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

FlashPolicyServer::FlashPolicyServer()
	: FlashPolicyServer
	(
		make_shared<XML>
		(
			std::string() +
			"<cross-domain-policy>\n" +
			"	<allow-access-from domain='*' to-ports='*' />\n" +
			"</cross-domain-policy>"
		)
	)
{
}
FlashPolicyServer::FlashPolicyServer(shared_ptr<XML> policy_)
{
	this->policy_ = policy_;
}

void FlashPolicyServer::open()
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
void FlashPolicyServer::accept(Socket *socket)
{
	string data = "<?xml version=\"1.0\"?>\n" + policy_->to_string();
	vector<unsigned char> piece;
	boost::system::error_code error;

	while (true)
	{
		piece.assign(1000, NULL);
		socket->read_some(boost::asio::buffer(piece), error);

		boost::system::error_code error;
		socket->write_some(boost::asio::buffer(data), error);

		break;
	}
	socket->close();

	delete socket;
}