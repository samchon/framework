#include <samchon/User.hpp>
#include <samchon/Server.hpp>
#include <samchon/Client.hpp>

#include <boost/asio.hpp>
#include <mutex>
#include <samchon/Invoke.hpp>
#include <samchon/SmartPointer.hpp>

namespace samchon
{
	/* --------------------------------------------------------
		CONSTRUCTORS
	-------------------------------------------------------- */
	User::BasicUser(const Server *server, const pair<string, string> &ipPair)
		: super()
	{
		this->server = server;
		this->ipPair = ipPair;

		sequence = 1;
		id = "guest";
		authority = 1;
	}
	template<> User::~BasicUser() 
	{
	}

	template<> auto User::__keepAlive(Client *client) -> UserClientPair
	{
		return UserClientPair(this, client);
	}
	template<> void User::setMember(const string &id, long authority)
	{
		this->id = id;
		this->authority = authority;
	}

	/* --------------------------------------------------------
		GETTERS
	-------------------------------------------------------- */
	template<> auto User::getServer() const -> const Server*
	{
		return server;
	}
	template<> auto User::getIPPair() const -> pair<string, string>
	{
		return ipPair;
	}
	template<> auto User::getID() const -> string
	{
		return id;
	}
	template<> auto User::getAuthority() const -> long
	{
		return authority;
	}

	/* --------------------------------------------------------
		MANAGING CLIENT
	-------------------------------------------------------- */
	template<> void User::addClient(void *socket)
	{
		mtx.lock();
		SmartPointer<Client> client(createClient(++sequence, socket));
		this->set(sequence, client);
		mtx.unlock();

		client->listen();
		eraseClient(client->getNo());
	}
	template<> void User::eraseClient(long no)
	{
		auto &ucPair = __keepAlive();

		Sleep(15 * 1000);
		mtx.lock();
		{
			erase(no);
			if (size() == 0)
				((Server*)server)->eraseUser(this->ipPair);
		}
		mtx.unlock();
	}

	/* --------------------------------------------------------
		AUTHENTIFICATION
	-------------------------------------------------------- */
	template<> void User::goLogin(Client *client, shared_ptr<Invoke> invoke)
	{
		KEEP_USER_ALIVE;
		bool result = doLogin(invoke);

		shared_ptr<Invoke> reply(new Invoke("handleLogin"));
		reply->add("result", "bool", to_string(result));

		client->sendData(reply);
	}
	template<> void User::goJoin(Client *client, shared_ptr<Invoke> invoke)
	{
		KEEP_USER_ALIVE;
		bool result = doJoin(invoke);

		shared_ptr<Invoke> reply(new Invoke("handleJoin"));
		reply->add("result", "bool", to_string(result));

		client->sendData(reply);
	}
	template<> void User::goLogout(Client *client)
	{
		shared_ptr<Invoke> invoke(new Invoke("doLogout"));
		for (auto it = begin(); it != end(); it++)
			if (it->second.get() == client)
				continue;
			else
				it->second->sendData(invoke);

		id = "guest";
		authority = 0;

		clear();
	}
};