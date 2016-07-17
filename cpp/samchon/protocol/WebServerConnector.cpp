#include <samchon/protocol/WebServerConnector.hpp>

#include <array>
#include <random>
#include <boost/asio.hpp>
#include <samchon/library/StringUtil.hpp>
#include <samchon/protocol/WebSocketUtil.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

map<pair<string, int>, string> WebServerConnector::s_cookies;
RWMutex WebServerConnector::s_mtx;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
WebServerConnector::WebServerConnector(IProtocol *listener)
	: super(listener),
	WebCommunicator(false)
{
}
WebServerConnector::~WebServerConnector()
{
}

/* ---------------------------------------------------------
	CONNECTION
--------------------------------------------------------- */
void WebServerConnector::connect(const string &ip, int port)
{
	connect(ip, port, "");
}
void WebServerConnector::connect(const string &ip, int port, const string &path)
{
	if (socket != nullptr && socket->is_open() == true)
		return;

	io_service.reset(new boost::asio::io_service());
	endpoint.reset(new boost::asio::ip::tcp::endpoint(boost::asio::ip::address::from_string(ip), port));

	socket.reset(new boost::asio::ip::tcp::socket(*io_service, boost::asio::ip::tcp::v4()));
	socket->connect(*endpoint);

	handshake(ip, port, path);

	listen_message();
}

void WebServerConnector::handshake(const string &ip, int port, const string &path)
{
	///////
	// SEND HEADER
	///////
	// CERTIFICATION KEY
	string &base64_key = WebSocketUtil::generate_base64_certification_key();
	string &sha1_key = WebSocketUtil::encode_certification_key(base64_key);

	// COOKIE
	string cookie;
	{
		UniqueReadLock uk(s_mtx);
		auto it = s_cookies.find({ip, port});

		if (it != s_cookies.end())
			cookie = "Cookie: " + it->second + "\r\n";
	}
	
	// SEND
	string &query = StringUtil::substitute
	(
		string("") +
		"GET {1} HTTP/1.1\r\n" + //path
		"Host: {2}\r\n" + //ip:port
		"Upgrade: websocket\r\n" +
		"Connection: Upgrade\r\n" +
		"{3}" + // cookie
		"Sec-WebSocket-Key: {4}\r\n" + // hashed certification key
		"Sec-WebSocket-Version: 13\r\n" +
		"\r\n",

		path.empty() ? "/" : "/" + path,
		ip + ":" + to_string(port),
		cookie,
		base64_key
	);
	socket->write_some(boost::asio::buffer(query.data(), query.size()));

	///////
	// LISTEN HEADER
	///////
	array<unsigned char, 1000> byte_array;
	size_t size = socket->read_some(boost::asio::buffer(byte_array));

	WeakString wstr((const char*)byte_array.data(), size);
	string server_sha1 = wstr.between("Sec-WebSocket-Accept: ", "\r\n").str();

	// INSPECT VALIDITY
	if (sha1_key != server_sha1)
		throw std::domain_error("WebSocket handshaking has failed.");

	// SET-COOKIE
	if (wstr.find("Set-Cookie: ") != string::npos)
	{
		WeakString set_cookie = wstr.between("Set-Cookie: ", "\r\n");
		UniqueWriteLock uk(s_mtx);

		s_cookies[{ip, port}] = set_cookie.str();
	}
}