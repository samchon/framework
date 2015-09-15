#include <samchon/protocol/service/Server.hpp>
#	include <samchon/protocol/service/User.hpp>
#	include <samchon/protocol/service/IPUserPair.hpp>

#include <boost/asio.hpp>
#include <mutex>
#include <thread>
#include <sstream>

#include <samchon/SmartPointer.hpp>
#include <samchon/library/SQLi.hpp>
#include <samchon/library/Datetime.hpp>

#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>
#include <samchon/protocol/InvokeParameter.hpp>

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
	: super(), IServer()
{
	sqli = nullptr;
	sequence = 0;
}
Server::~Server()
{
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
	ACCESSORS OF MAP
-------------------------------------------------------- */
auto Server::size() const -> size_t
{
	return super::size();
}
auto Server::begin() const -> const_iterator
{
	return super::begin();
}
auto Server::end() const -> const_iterator
{
	return super::end();
}

/* --------------------------------------------------------
	ACCOUNT & REGISTER MANAGER
-------------------------------------------------------- */
void Server::addClient(tcp::socket *socket)
{
	thread([this, socket]()
	{
		//GET IP
		std::string ip = socket->remote_endpoint().address().to_v4().to_string();
			
		unique_ptr<unique_lock<mutex>> uk(new unique_lock<mutex>(mtx));
		if (ipMap.has(ip) == false)
			ipMap.set
			(
				ip, 
				shared_ptr<IPUserPair>(new IPUserPair(this, ip))
			);

		shared_ptr<IPUserPair> pair = ipMap.get(ip);
		sequence++;
		uk->unlock();

		//GET SESSION_ID
		std::string &sessionID = pair->getSessionID(socket, sequence);
			
		uk->lock();

		//FAILED TO GET SESSION ID
		if (sessionID.empty() == true)
		{
			//ERASE PAIR FROM CONTAINER
			if (pair->userSet.size() == 1)
				ipMap.erase(ip);
			
			return;
		}

		iterator it = find(sessionID);
		if (it == end())
		{
			//CREATE USER AND LINK CONNECTION BY PAIR
			SmartPointer<User> user( createUser(sessionID) );
			user->ipPair = pair.get();
			pair->userSet.insert(user.get());

			it = insert({ sessionID, user }).first;
		}
		uk.reset(nullptr);

		//WILL HOLD A THREAD
		it->second->addClient(socket);
	}).detach();
}
void Server::eraseUser(const std::string &session)
{
	Sleep(15 * 1000);

	unique_lock<mutex> uk(mtx);
	if (!(has(session) == true && get(session)->empty() == true))
		return;

	User *user = get(session).get();
	IPUserPair *ipPair = user->ipPair;

	if (ipPair->userSet.empty() == true)
		ipMap.erase(user->ipPair->ip);

	super::erase(session);
}