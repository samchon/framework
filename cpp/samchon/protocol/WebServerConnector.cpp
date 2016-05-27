#include <samchon/protocol/WebServerConnector.hpp>

#include <random>
#include <boost/asio.hpp>
#include <boost/uuid/sha1.hpp>
#include <samchon/library/Base64.hpp>
#include <samchon/library/StringUtil.hpp>

#include <samchon/protocol/IWebServer.hpp>
#include <samchon/protocol/WebSocketUtil.hpp>

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
	super::connect();

	handshake();
}

void WebServerConnector::handshake()
{
	// CERTIFICATION KEY
	string &base64_key = WebSocketUtil::generate_base64_certification_key();
	string &sha1_key = WebSocketUtil::encode_certification_key(base64_key);

	// SEND
	string &query = StringUtil::substitute
	(
		string("") +
		"GET {1} HTTP/1.1\r\n" +
		"Host: {2}\r\n" +
		"Upgrade: websocket\r\n" +
		"Connection: Upgrade\r\n" +
		"Sec-WebSocket-Key: {3}\r\n" +
		"Sec-WebSocket-Version: 13\r\n" +
		"\r\n",

		get_path(),
		getIP() + ":" + to_string(getPort()),
		base64_key
	);
	socket->write_some(boost::asio::buffer(query.data(), query.size()));

	// LISTEN
	array<char, 1000> byte_array;
	size_t size = socket->read_some(boost::asio::buffer(byte_array));

	WeakString wstr(byte_array.data(), size);
	string server_sha1 = wstr.between("Sec-WebSocket-Accept: ", "\r\n").str();

	// INSPECT VALIDITY
	if (sha1_key != server_sha1)
		throw std::invalid_argument("WebSocket handshake failed");
}