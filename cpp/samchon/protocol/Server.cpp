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
	if (_Acceptor == nullptr || _Acceptor->is_open() == false)
		return;

	close();
}

void Server::open(int port)
{
	if (_Acceptor != nullptr && _Acceptor->is_open())
		return;

	boost::asio::io_service io_service;
	boost::asio::ip::tcp::endpoint endpoint(boost::asio::ip::tcp::v4(), port);
	boost::system::error_code error;

	_Acceptor.reset(new boost::asio::ip::tcp::acceptor(io_service, endpoint));

	while (true)
	{
		shared_ptr<Socket> socket(new boost::asio::ip::tcp::socket(io_service));
		_Acceptor->accept(*socket);

		if (error)
			break;

		thread(&Server::handle_connection, this, socket).detach();
	}
}

void Server::close()
{
	if (_Acceptor == nullptr)
		return;

	_Acceptor->cancel();
	_Acceptor->close();
}

void Server::handle_connection(shared_ptr<Socket> socket)
{
	addClient(make_shared<ClientDriver>(socket));
}