#include <samchon/protocol/WebServer.hpp>

#include <samchon/protocol/WebClientDriver.hpp>
#include <samchon/protocol/WebSocketUtil.hpp>

#include <array>
#include <random>
#include <sstream>
#include <boost/asio.hpp>

#include <samchon/WeakString.hpp>
#include <samchon/library/StringUtil.hpp>
#include <samchon/library/Date.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

WebServer::WebServer()
	: super()
{
	sequence = 0;
}
WebServer::~WebServer()
{
}

void WebServer::handleConnection(shared_ptr<Socket> socket)
{
	array<char, 1000> byte_array;
	boost::system::error_code error;

	///////
	// LISTEN HEADER
	///////
	size_t size = socket->read_some(boost::asio::buffer(byte_array), error);
	if (error)
		return;

	// HEADER FROM CLIENT
	WeakString header(byte_array.data(), size);

	// KEY VALUES
	WeakString path = header.between("", "\r\n").between(" /", " HTTP");
	string session_id;
	string cookie;

	WeakString encrypted_cert_key;

	// DECODE ENCRYPTED CERTIFICATION KEY
	encrypted_cert_key = header.between("Sec-WebSocket-Key:", "\n").trim();

	if(encrypted_cert_key.find("\r") != string::npos)
		encrypted_cert_key = encrypted_cert_key.between("", "\r");

	if (header.find("Set-Cookie: ") != string::npos)
	{
		cookie = header.between("Set-Cookie: ", "\r\n");

		size_t session_id_idx = header.find("SESSION_ID=");
		if (session_id_idx == string::npos)
		{
			// ISSUE A NEW SESSION_ID AND ADD IT TO ORDINARY COOKIES
			session_id = issue_session_id();
			cookie += "; SESSION_ID=" + session_id;
		}
		else
		{
			// FETCH ORDINARY SESSION_ID
			session_id = header.substr
				(
					session_id_idx + 11, 
					std::min
					(
						header.find(";", session_id_idx),
						header.find("\r\n", session_id_idx)
					)
				);
		}
	}
	else
	{
		// NO COOKIE EXISTS
		session_id = issue_session_id();
		cookie = "SESSION_ID=" + session_id;
	}

	///////
	// SEND HEADER
	///////
	// CONSTRUCT REPLY MESSAGE
	string &reply_header = StringUtil::substitute
		(
			string("") +
				"HTTP/1.1 101 Switching Protocols\r\n" +
				"Upgrade: websocket\r\n" +
				"Connection: Upgrade\r\n" +
				"Set-Cookie: {1}\r\n" +
				"Sec-WebSocket-Accept: {2}\r\n" +
				"\r\n",

			cookie,
			WebSocketUtil::encode_certification_key(encrypted_cert_key)
		);

	// SEND
	socket->write_some(boost::asio::buffer(reply_header), error);
	if (error)
		return;

	///////
	// ADD CLIENT
	///////
	// CREATE DRIVER
	shared_ptr<WebClientDriver> driver(new WebClientDriver(this, socket));
	driver->session_id = session_id;
	driver->path = path.str();

	// ADD CLIENT
	addClient(driver);
}

auto WebServer::issue_session_id() -> string
{
	static uniform_int_distribution<unsigned int> distribution(0, UINT32_MAX);
	static random_device device;

	unsigned int port = acceptor->local_endpoint().port();
	size_t uid = ++sequence;
	long long linux_time = Date().toLinuxTime();
	unsigned int rand = distribution(device);

	stringstream ss;
	ss << hex << port;
	ss << hex << uid;
	ss << hex << linux_time;
	ss << hex << rand;

	return ss.str();
}