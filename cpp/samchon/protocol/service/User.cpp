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
User::User(Server *server)
	: super()
{
	this->server = server;
	
	semaphore = new Semaphore(2);
	sequence = 0;

	id = "guest";
	authority = 1;
}
User::~User()
{
}

/* --------------------------------------------------------
	GETTERS
-------------------------------------------------------- */
auto User::getServer() const -> Server*
{
	return server;
}
auto User::getID() const -> std::string
{
	return id;
}
auto User::getAuthority() const -> int
{
	return authority;
}

auto User::getSemaphore() const -> Semaphore*
{
	return semaphore;
}

auto User::size() const -> size_t
{
	return super::size();
}
auto User::begin() const -> const_iterator
{
	return super::begin();
}
auto User::end() const -> const_iterator
{
	return super::end();
}

/* --------------------------------------------------------
	CLIENT FACTORY
-------------------------------------------------------- */
void User::addClient(Socket *socket)
{
	UniqueWriteLock uk(mtx);

	size_t no = ++sequence;

	SmartPointer<Client> client(createClient());
	client->user = this;
	client->no = no;
	client->socket = socket;

	this->set(no, client);
	
	uk.unlock();

	client->listen();
	this->eraseClient(no);
}
void User::eraseClient(size_t no)
{
	KEEP_USER_ALIVE;
	
	UniqueWriteLock uk(mtx);
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
void User::goLogin(shared_ptr<Invoke> invoke)
{
	bool result = doLogin(invoke);

	shared_ptr<Invoke> reply(new Invoke("handleLogin"));
	reply->emplace_back(new InvokeParameter("result", result));
	reply->emplace_back(new InvokeParameter("authority", authority));

	this->sendData(reply);
}
void User::goJoin(shared_ptr<Invoke> invoke)
{
	bool success = doJoin(invoke);

	shared_ptr<Invoke> reply(new Invoke("handleJoin"));
	reply->emplace_back(new InvokeParameter("success", success));

	this->sendData(reply);
}
void User::goLogout()
{
	id = "guest";
	authority = 0;

	shared_ptr<Invoke> invoke(new Invoke("doLogout"));
	this->sendData(invoke);
}

/* --------------------------------------------------------
	MESSAGE CHAIN
-------------------------------------------------------- */
void User::sendData(shared_ptr<Invoke> invoke)
{
	KEEP_USER_ALIVE;
	UniqueReadLock uk(mtx);

	for(auto it = begin(); it != end(); it++)
		thread(&Client::sendData, it->second, invoke).detach();
}
void User::replyData(shared_ptr<Invoke> invoke)
{
	KEEP_USER_ALIVE;

	if (invoke->getListener() == "goLogin")
	{
		this->goLogin(invoke);
	}
	else if(invoke->getListener() == "goJoin")
	{
		this->goJoin(invoke);
	}
	else if(invoke->getListener() == "goLogout")
	{
		this->goLogout();
	}
}