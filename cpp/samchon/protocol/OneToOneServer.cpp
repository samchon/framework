#include <samchon/protocol/OneToOneServer.hpp>

#include <boost/asio.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::protocol;
using namespace boost::asio::ip;

OneToOneServer::OneToOneServer()
	: IServer(), IClient()
{
}

void OneToOneServer::addClient(tcp::socket *socket)
{
	IClient::socket = socket;
	
	listen();
}