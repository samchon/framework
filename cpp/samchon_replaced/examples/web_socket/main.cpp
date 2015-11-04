#include <iostream>
#include <vector>
#include <string>

#include <thread>
#include <boost/asio.hpp>
#include <boost/uuid/sha1.hpp>
#include <boost/format.hpp>

#include <samchon/ByteArray.hpp>
#include <samchon/WeakString.hpp>
#include <samchon/library/Base64.hpp>
#include <samchon/library/StringUtil.hpp>
#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

#ifdef _WIN64
#	ifdef _DEBUG
#		pragma comment(lib, "x64/Debug/SamchonFramework.lib")
#	else
#		pragma comment(lib, "x64/Release/SamchonFramework.lib")
#	endif
#else
#	ifdef _DEBUG
#		pragma comment(lib, "Debug/SamchonFramework.lib")
#	else
#		pragma comment(lib, "Release/SamchonFramework.lib")
#	endif
#endif

using namespace std;
using namespace boost::asio;
using namespace boost::asio::ip;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

auto calculateCertKey(const string &key_64) -> string
{
	string acceptKey = key_64 + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
	
	boost::uuids::detail::sha1 hash;
	hash.process_bytes(acceptKey.c_str(), acceptKey.size());

	ByteArray bytes;
	unsigned int digest[5];
	hash.get_digest(digest);

	for (unsigned int index = 0; index < 5; index++)
	{
		bytes.writeReversely //ENDIAN REVERSING
		(
			digest[index]
		);
	}

	return Base64::encode(bytes);
}
void sendData(tcp::socket *socket, const string &msg)
{
	boost::system::error_code error;

	ByteArray header;
	header.push_back(129);

	if (msg.size() < 126)
	{
		//DO NOTHING
	}
	else if(header.size() <= 65535)
	{
		header.push_back(126);	
		header.writeReversely((unsigned short)msg.size());
	}
	else
	{
		header.push_back(127);
		header.writeReversely((unsigned long long)msg.size());
	}

	//socket->write_some(boost::asio::buffer(header), error);
	socket->write_some(boost::asio::buffer(header), error);
	socket->write_some(boost::asio::buffer(msg), error);
}
auto handshake(tcp::socket *socket) -> bool
{
	vector<unsigned char> buffer(1000, NULL);
	boost::system::error_code error;

	socket->read_some(boost::asio::buffer(buffer), error);
	if(error)
		return false;

	//READ CERT KEY
	string headers = (char*)buffer.data();
	WeakString wstr = headers;

	cout << headers << endl << endl;

	wstr = wstr.between("Sec-WebSocket-Key:", "\n").trim();
	if(wstr.find("\r") != string::npos)
		wstr = wstr.between("", "\r");
	
	string certKey = wstr.str();

	//CALCULATE CERT KEY AND REPLY
	string &handshake = 
		StringUtil::substitute
		(
			string("") +
			"HTTP/1.1 101 Switching Protocols\r\n" +
			"Upgrade: websocket\r\n" +
			"Connection: Upgrade\r\n" +
			"Sec-WebSocket-Accept: {1}\r\n" +
			"\r\n",

			calculateCertKey(certKey)
		);
	cout << handshake << endl << endl << endl << endl;
	socket->write_some(boost::asio::buffer(handshake), error);

	{
		shared_ptr<Invoke> invoke(new Invoke("ABCD", "EFGH", 4.0, "hkij", 1));
		
		sendData(socket, invoke->toXML()->toString());
	}
}

void addClient(tcp::socket *socket)
{
	if(handshake(socket) == false)
		return;

	while (true)
	{
		vector<unsigned char> buffer(1000, NULL);
		boost::system::error_code error;

		socket->read_some(boost::asio::buffer(buffer), error);
		if(error)
			break;
	}
}
void openServer()
{
	io_service ioService;
	tcp::endpoint endPoint(tcp::v4(), 11071);

	tcp::acceptor acceptor(ioService, endPoint);

	while (true)
	{
		tcp::socket *socket = new tcp::socket(ioService);
		boost::system::error_code error;

		acceptor.accept(*socket, error);

		if (error)
		{
			delete socket;
			break;
		}
		thread(addClient, socket).detach();
	}
}

void main()
{
	openServer();
}