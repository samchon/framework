#include <samchon/protocol/IWebServer.hpp>

#include <thread>
#include <boost/asio.hpp>
#include <boost/uuid/sha1.hpp>

#include <samchon/ByteArray.hpp>
#include <samchon/WeakString.hpp>
#include <samchon/library/Base64.hpp>
#include <samchon/library/StringUtil.hpp>

#include <samchon/protocol/WebSocketUtil.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

/* -----------------------------------------------------------------------
	CONSTRUCTORS
----------------------------------------------------------------------- */
IWebServer::IWebServer()
	: super()
{
}
void IWebServer::open()
{
	if (acceptor != nullptr && acceptor->is_open() == true)
		return;

	boost::system::error_code error;
	boost::asio::io_service ioService;
	unique_ptr<boost::asio::ip::tcp::endpoint> endPoint;

	if (acceptor == nullptr)
	{
		string &myIP = MY_IP();

		if (myIP.empty() == true)
		{
			endPoint.reset( new boost::asio::ip::tcp::endpoint(boost::asio::ip::tcp::v4(), PORT()) );
		}
		else
		{
			endPoint.reset( new boost::asio::ip::tcp::endpoint( boost::asio::ip::address::from_string(myIP), PORT() ) );
		}
		acceptor = new boost::asio::ip::tcp::acceptor(ioService, *endPoint);
	}

	while (true)
	{
		Socket *socket = new Socket(ioService);
		acceptor->accept(*socket, error);

		if (error)
		{
			delete socket;
			break;
		}

		thread
		(
			[this, socket]
			{
				if (handshake(socket) == true)
					addClient(socket);
			}
		).detach();
	}
	delete acceptor;
	acceptor = nullptr;
}

/* -----------------------------------------------------------------------
	HANDSHAKE OF WEB-SOCKET
----------------------------------------------------------------------- */
auto IWebServer::handshake(Socket *socket) const -> bool
{
	array<char, 1000> byte_array;
	boost::system::error_code error;

	size_t size = socket->read_some(boost::asio::buffer(byte_array), error);
	if (error)
		return false;

	WeakString wstr(byte_array.data(), size);

	wstr = wstr.between("Sec-WebSocket-Key:", "\n").trim();
	if(wstr.find("\r") != string::npos)
		wstr = wstr.between("", "\r");

	string &handshake =
		StringUtil::substitute
		(
			string("") +
				"HTTP/1.1 101 Switching Protocols\r\n" +
				"Upgrade: websocket\r\n" +
				"Connection: Upgrade\r\n" +
				"Sec-WebSocket-Accept: {1}\r\n" +
				"\r\n",

			WebSocketUtil::encode_certification_key(wstr.str())
		);

	socket->write_some(boost::asio::buffer(handshake), error);
	if (error)
		return false;
	else
		return true;
}