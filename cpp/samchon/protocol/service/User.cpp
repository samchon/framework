#include <samchon/protocol/service/User.hpp>
#	include <samchon/protocol/service/Server.hpp>
#	include <samchon/protocol/service/Client.hpp>

#include <boost/asio.hpp>

#include <mutex>
#include <samchon/library/Semaphore.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::service;

using namespace boost::asio;
using namespace boost::asio::ip;

/* --------------------------------------------------------
	CONSTRUCTORS
-------------------------------------------------------- */
User::User(Server *server, const String &sessionID)
	: super()
{
	this->server = server;
	this->sessionID = sessionID;
	
	semaphore = new Semaphore(2);
	sequence = 0;

	id = _T("guest");
	authority = 1;
}
User::~User()
{
}

auto User::__keepAlive(Client *client) -> ServiceKeeper
{
	return ServiceKeeper(this, client);
}

/* --------------------------------------------------------
	GETTERS
-------------------------------------------------------- */
auto User::getServer() const -> Server*
{
	return server;
}
auto User::getID() const -> String
{
	return id;
}
auto User::getAuthority() const -> int
{
	return authority;
}

/* --------------------------------------------------------
	MANAGING CLIENT
-------------------------------------------------------- */
void User::addClient(Socket *socket)
{
	unique_lock<mutex> uk(mtx);

	size_t no = ++sequence;

	SmartPointer<Client> client(createClient(no, socket));
	this->set(no, client);
	
	uk.unlock();

	client->listen();
	this->eraseClient(no);
}
void User::eraseClient(size_t no)
{
	auto &ucPair = __keepAlive();
	
	unique_lock<mutex> uk(mtx);
	{
		super::erase(no);
	}
	uk.unlock();

	if (empty() == true)
		server->eraseUser(sessionID);
}

/* --------------------------------------------------------
	AUTHENTIFICATION
-------------------------------------------------------- */
void User::goLogin(Client *client, shared_ptr<Invoke> invoke)
{
	KEEP_USER_ALIVE;
	bool result = doLogin(invoke);

	shared_ptr<Invoke> reply(new Invoke(_T("handleLogin")));
	reply->push_back(new InvokeParameter(_T("result"), result));

	client->sendData(reply);
}
void User::goJoin(Client *client, shared_ptr<Invoke> invoke)
{
	KEEP_USER_ALIVE;
	bool result = doJoin(invoke);

	shared_ptr<Invoke> reply(new Invoke(_T("handleJoin")));
	reply->push_back(new InvokeParameter(_T("result"), result));

	client->sendData(reply);
}
void User::goLogout(Client *client)
{
	KEEP_USER_ALIVE;

	shared_ptr<Invoke> invoke(new Invoke(_T("doLogout")));
	for (auto it = begin(); it != end(); it++)
		it->second->sendData(invoke);

	id = _T("guest");
	authority = 0;

	clear();
}