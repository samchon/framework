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
	WServer::BasicServer()
		: super()
	{
	}
	template<> WServer::~BasicServer()
	{
		closeServer();
	}

	/* --------------------------------------------------------
		GETTERS
	-------------------------------------------------------- */
	template<> auto WServer::getSQLi() const -> WSQLi*
	{
		return sqli.get();
	}
	template<> auto WServer::getIP() const -> wstring
	{
		return ip;
	}

	/* --------------------------------------------------------
		OPEN & CLOSE SERVER
	-------------------------------------------------------- */
	template<> void WServer::openServer()
	{
		boost::asio::io_service ioService;
		boost::asio::ip::tcp::endpoint endPoint(boost::asio::ip::tcp::v4(), PORT());
		boost::asio::ip::tcp::acceptor acceptor(ioService, endPoint);

		this->ip = WCharset::_t( endPoint.address().to_v4().to_string() );

		while (true)
		{
			boost::asio::ip::tcp::socket *socket = new boost::asio::ip::tcp::socket(ioService);
			acceptor.accept(*socket);

			thread(&WServer::addClient, this, socket).detach();
		}
	}
	template<> void WServer::closeServer()
	{
		sqli->disconnect();
	}

	/* --------------------------------------------------------
		ACCOUNT & REGISTER MANAGER
	-------------------------------------------------------- */
	template<> void WServer::addClient(void *s)
	{
		boost::asio::ip::tcp::socket *socket = (boost::asio::ip::tcp::socket*)s;
		boost::asio::ip::address &address = socket->remote_endpoint().address();
		wstring &ip = WCharset::_t( address.to_v4().to_string() );
		wstring uniqueID;

		//GET UNIQUE_ID FROM CLIENT
		{
			wstring data;
			vector<wchar_t> piece;
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

		pair<wstring, wstring> ipPair = { ip, uniqueID };
		iterator it;

		mtx.lock();
		{
			it = find(ipPair);
			if (it == end())
			{
				SmartPointer<WUser> user(createUser(ipPair));

				this->set(ipPair, user);
				it = find(ipPair);
			}
		}
		mtx.unlock();
		
		it->second->addClient(socket);
	}
	template<> void WServer::eraseUser(const pair<wstring, wstring> &ipPair)
	{
		mtx.lock();
		if (has(ipPair) == true)
			erase(ipPair);
		mtx.unlock();
	}
};