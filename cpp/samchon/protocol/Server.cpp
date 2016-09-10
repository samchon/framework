#include <samchon/protocol/Server.hpp>

#include <samchon/protocol/ClientDriver.hpp>

#include <thread>
#include <boost/asio.hpp>

using namespace std;
using namespace samchon::protocol;

Server::Server()
{
}
Server::~Server()
{
	if (acceptor == nullptr || acceptor->is_open() == false)
		return;

	close();
}

void Server::open(int port)
{
	if (acceptor != nullptr && acceptor->is_open())
		return;

	boost::asio::io_service io_service;
	boost::asio::ip::tcp::endpoint endpoint(boost::asio::ip::tcp::v4(), port);
	boost::system::error_code error;

	acceptor.reset(new boost::asio::ip::tcp::acceptor(io_service, endpoint));

	while (true)
	{
		shared_ptr<Socket> socket(new boost::asio::ip::tcp::socket(io_service));
		acceptor->accept(*socket);

		if (error)
			break;

		thread(&Server::handle_connection, this, socket).detach();
	}
}

void Server::close()
{
	if (acceptor == nullptr)
		return;

	acceptor->cancel();
	acceptor->close();
}

void Server::handle_connection(shared_ptr<Socket> socket)
{
	addClient(make_shared<ClientDriver>(this, socket));
}