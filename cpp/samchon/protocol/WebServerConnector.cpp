#include <samchon/protocol/WebServerConnector.hpp>

#include <boost/asio.hpp>
#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;

WebServerConnector::WebServerConnector()
	: super(),
	web_super()
{
}

auto WebServerConnector::is_server() const -> bool
{
	return false;
}

void WebServerConnector::connect()
{
	//CONNECT
	super::connect();

	//HANDSHAKE
	
}