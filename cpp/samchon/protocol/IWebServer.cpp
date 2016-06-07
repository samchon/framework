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

		thread(&IWebServer::handshake, this, socket).detach();
	}
	delete acceptor;
	acceptor = nullptr;
}

/* -----------------------------------------------------------------------
	HANDSHAKE OF WEB-SOCKET
----------------------------------------------------------------------- */
void IWebServer::addClient(Socket *socket)
{
	handshake(socket);
}

void IWebServer::handshake(Socket *socket)
{
	array<char, 1000> byte_array;
	boost::system::error_code error;

	size_t size = socket->read_some(boost::asio::buffer(byte_array), error);
	if (error)
		return;

	WeakString wstr(byte_array.data(), size);
	WeakString path = wstr.between("", "\r\n").between(" /", " HTTP");
	WeakString encrypted_cert_key;
	string session_id;

	// DECODE ENCRYPTED CERTIFICATION KEY
	encrypted_cert_key = wstr.between("Sec-WebSocket-Key:", "\n").trim();
	if(encrypted_cert_key.find("\r") != string::npos)
		encrypted_cert_key = encrypted_cert_key.between("", "\r");

	// FETCH OR ISSUE SESSION_ID
	if (wstr.find("SESSION_ID") == string::npos)
		session_id = WebSocketUtil::issue_session_id();
	else
	{
		session_id = wstr.between("SESSION_ID=", "\r\n");
		if (session_id.back() == ';')
			session_id.pop_back();
	}

	// REPLY HANDSHAKE MESSAGE
	string &handshake = StringUtil::substitute
		(
			string("") +
				"HTTP/1.1 101 Switching Protocols\r\n" +
				"Upgrade: websocket\r\n" +
				"Connection: Upgrade\r\n" +
				"Sec-WebSocket-Accept: {1}\r\n" +
				"Set-Cookie: SESSION_ID={2}\r\n" +
				"\r\n",

			WebSocketUtil::encode_certification_key(encrypted_cert_key),
			session_id
		);

	socket->write_some(boost::asio::buffer(handshake), error);
	if (error)
		return;
	else
		addClient(socket, path, session_id);
}