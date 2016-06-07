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
		string &myIP = MY_IP();
		if (myIP.empty() == true)
			endPoint.reset( new tcp::endpoint(tcp::v4(), PORT()) );
		else
			endPoint.reset( new tcp::endpoint( address::from_string(myIP), PORT() ) );
		
		acceptor = new tcp::acceptor(ioService, *endPoint);
	}

	while (true)
	{
		tcp::socket *socket = new tcp::socket(ioService);
		acceptor->accept(*socket, error);

		if (error)
		{
			delete socket;
			break;
		}
		thread(&IServer::addClient, this, socket).detach();
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