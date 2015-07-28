#include <samchon/protocol/service/User.hpp>
#	include <samchon/protocol/service/Server.hpp>
#	include <samchon/protocol/service/Client.hpp>

#include <samchon/protocol/Invoke.hpp>

#include <boost/asio.hpp>
#include <mutex>

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
User::User(Server *server, const pair<String, String> &ipPair)
	: super()
{
	mtx = new mutex();

	this->server = server;
	this->ipPair = ipPair;

	sequence = 1;
	id = _T("guest");
	authority = 1;
}
User::~User()
{
	delete mtx;
}

auto User::__keepAlive(Client *client) -> ServiceKeeper
{
	return ServiceKeeper(this, client);
}
void User::setMember(const String &id, long authority)
{
	this->id = id;
	this->authority = authority;
}

/* --------------------------------------------------------
	GETTERS
-------------------------------------------------------- */
auto User::getServer() const -> Server*
{
	return server;
}
auto User::getIPPair() const -> pair<String, String>
{
	return ipPair;
}
auto User::getID() const -> String
{
	return id;
}
auto User::getAuthority() const -> long
{
	return authority;
}

/* --------------------------------------------------------
	MANAGING CLIENT
-------------------------------------------------------- */
void User::addClient(tcp::socket *socket)
{
	mtx->lock();
		SmartPointer<Client> client(createClient(++sequence, socket));
		this->set(sequence, client);
	mtx->unlock();

	client->listen();
	eraseClient(client->getNo());
}
void User::eraseClient(long no)
{
	auto &ucPair = __keepAlive();

	Sleep(15 * 1000);
	mtx->lock();
	{
		erase(no);
		if (size() == 0)
			((Server*)server)->eraseUser(this->ipPair);
	}
	mtx->unlock();
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
	shared_ptr<Invoke> invoke(new Invoke(_T("doLogout")));
	for (auto it = begin(); it != end(); it++)
		if (it->second.get() == client)
			continue;
		else
			it->second->sendData(invoke);

	id = _T("guest");
	authority = 0;

	clear();
}