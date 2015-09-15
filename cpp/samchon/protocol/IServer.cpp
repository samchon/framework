#pragma once
#include <samchon/protocol/IServer.hpp>

#include <memory>
#include <mutex>
#include <thread>
#include <boost/asio.hpp>

using namespace samchon;
using namespace samchon::protocol;

using namespace std;
using namespace boost::asio;
using namespace boost::asio::ip;

auto IServer::MY_IP() const -> std::string { return ""; }

IServer::IServer() 
{
	acceptor = nullptr;
}
IServer::~IServer()
{
	close();

	if (acceptor != nullptr)
		delete acceptor;
}

void IServer::open()
{
	if (acceptor != nullptr && acceptor->is_open() == true)
		return;

	boost::system::error_code error;
	io_service ioService;
	unique_ptr<tcp::endpoint> endPoint;
	
	if (acceptor == nullptr)
	{
		if (MY_IP().empty() == true)
		{
			endPoint.reset( new tcp::endpoint(tcp::v4(), PORT()) );
		}
		else
		{
			std::string &tIP = MY_IP();
			string ip(tIP.begin(), tIP.end());

			endPoint.reset( new tcp::endpoint( address::from_string(ip), PORT() ) );
		}
		acceptor = new tcp::acceptor(ioService, *endPoint);
	}

	while (true)
	{
		tcp::socket *socket = new tcp::socket(ioService);
		acceptor->accept(*socket, error);

		if (error)
			break;

		addClient(socket);
	}
	delete acceptor;
	acceptor = nullptr;
}

void IServer::close()
{
	if (acceptor == nullptr)
		return;

	acceptor->cancel();
	acceptor->close();
}