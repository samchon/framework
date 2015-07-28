#include <samchon/protocol/service/Server.hpp>
#	include <samchon/protocol/service/User.hpp>

#include <samchon/SmartPointer.hpp>
#include <samchon/library/SQLi.hpp>
#include <samchon/library/Charset.hpp>

#include <boost/asio.hpp>
#include <mutex>
#include <thread>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::service;

using namespace boost::asio;
using namespace boost::asio::ip;

/* --------------------------------------------------------
CONSTRUCTORS & DESTRUCTORS
-------------------------------------------------------- */
Server::Server()
	: super()
{
	sqli = nullptr;
	containerMutex = new mutex();
}
Server::~Server()
{
	delete containerMutex;
	delete sqli;
}

/* --------------------------------------------------------
GETTERS
-------------------------------------------------------- */
auto Server::getSQLi() const -> SQLi*
{
	return sqli;
}

/* --------------------------------------------------------
ACCOUNT & REGISTER MANAGER
-------------------------------------------------------- */
void Server::addClient(tcp::socket *socket)
{
	thread(&Server::_addClient, this, socket).detach();
}
void Server::_addClient(tcp::socket *socket)
{
	boost::asio::ip::address &address = socket->remote_endpoint().address();
	string &_ip = address.to_v4().to_string();
	String ip(_ip.begin(), _ip.end());
	String uniqueID;

	//GET UNIQUE_ID FROM CLIENT -> SESSION_ID
	{
		String data;
		vector<TCHAR> piece;
		boost::system::error_code error;

		piece.assign(1000, NULL);
		socket->read_some(boost::asio::buffer(&piece[0], 1000), error);
		if (error)
		{
			socket->close();
			return;
		}
		uniqueID.append(piece.data());
	}

	pair<String, String> ipPair = { ip, uniqueID };
	iterator it;

	//TO HANDLE CHILD (USER)
	containerMutex->lock();
	{
		it = find(ipPair);
		if (it == end())
		{
			SmartPointer<User> user(createUser(ipPair));

			insert({ ipPair, user });
			it = find(ipPair);
		}
		it->second->addClient(socket);
	}
	containerMutex->unlock();
}
void Server::eraseUser(const pair<String, String> &ipPair)
{
	containerMutex->lock();
	{
		if (has(ipPair) == true)
			erase(ipPair);
	}
	containerMutex->unlock();
}
