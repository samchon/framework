#include <samchon/Server.hpp>
#include <samchon/User.hpp>
#include <samchon/SQLi.hpp>

#include <boost/asio.hpp>
#include <mutex>
#include <thread>
#include <samchon/Charset.hpp>
#include <samchon/SmartPointer.hpp>

namespace samchon
{
	/* --------------------------------------------------------
		CONSTRUCTORS & DESTRUCTORS
	-------------------------------------------------------- */
	Server::BasicServer()
		: super()
	{
	}
	template<> Server::~BasicServer()
	{
		closeServer();
	}

	/* --------------------------------------------------------
		GETTERS
	-------------------------------------------------------- */
	template<> auto Server::getSQLi() const -> SQLi*
	{
		return sqli.get();
	}
	template<> auto Server::getIP() const -> string
	{
		return ip;
	}

	/* --------------------------------------------------------
		OPEN & CLOSE SERVER
	-------------------------------------------------------- */
	template<> void Server::openServer()
	{
		boost::asio::io_service ioService;
		boost::asio::ip::tcp::endpoint endPoint(boost::asio::ip::tcp::v4(), PORT());
		boost::asio::ip::tcp::acceptor acceptor(ioService, endPoint);

		this->ip = endPoint.address().to_v4().to_string();

		while (true)
		{
			boost::asio::ip::tcp::socket *socket = new boost::asio::ip::tcp::socket(ioService);
			acceptor.accept(*socket);

			thread(&Server::addClient, this, socket).detach();
		}
	}
	template<> void Server::closeServer()
	{
		sqli->disconnect();
	}

	/* --------------------------------------------------------
		ACCOUNT & REGISTER MANAGER
	-------------------------------------------------------- */
	template<> void Server::addClient(void *s)
	{
		boost::asio::ip::tcp::socket *socket = (boost::asio::ip::tcp::socket*)s;

		boost::asio::ip::address &address = socket->remote_endpoint().address();
		string &ip = address.to_v4().to_string();
		string uniqueID;

		//GET UNIQUE_ID FROM CLIENT
		{
			string data;
			vector<char> piece;
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

		pair<string, string> ipPair = { ip, uniqueID };
		iterator it;

		//TO HANDLE CHILD (USER)
		mtx.lock();
		{
			it = find(ipPair);
			if (it == end())
			{
				SmartPointer<User> user(createUser(ipPair));

				insert({ ipPair, user });
				it = find(ipPair);
			}
		}
		mtx.unlock();

		it->second->addClient(socket);
	}
	template<> void Server::eraseUser(const pair<string, string> &ipPair)
	{
		mtx.lock();
		if (has(ipPair) == true)
			erase(ipPair);
		mtx.unlock();
	}
};