#include <samchon/protocol/IWebServer.hpp>

#include <thread>
#include <boost/asio.hpp>
#include <boost/uuid/sha1.hpp>

#include <samchon/ByteArray.hpp>
#include <samchon/WeakString.hpp>
#include <samchon/library/Base64.hpp>
#include <samchon/library/StringUtil.hpp>

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
	ByteArray byteArray;
	boost::system::error_code error;

	byteArray.assign(1000, NULL);

	size_t size = socket->read_some(boost::asio::buffer(byteArray), error);
	if (error)
		return false;

	string header(byteArray.begin(), byteArray.begin() + size);

	WeakString wstr = header;
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

			calculateCertificationKey(wstr.str())
		);

	socket->write_some(boost::asio::buffer(handshake), error);
	if (error)
		return false;
	else
		return true;
}
auto IWebServer::calculateCertificationKey(const string &key64) const -> string
{
	string acceptKey = key64 + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

	boost::uuids::detail::sha1 hash;
	hash.process_bytes(acceptKey.c_str(), acceptKey.size());

	ByteArray bytes;
	unsigned int digest[5];
	hash.get_digest(digest);

	for (size_t index = 0; index < 5; index++)
		bytes.writeReversely //ENDIAN REVERSING
		(
			digest[index]
		);

	return Base64::encode(bytes);
}
