#include <samchon/User.hpp>
#include <samchon/Server.hpp>
#include <samchon/Client.hpp>

#include <thread>
#include <boost/asio.hpp>
#include <samchon/Invoke.hpp>
#include <samchon/SmartPointer.hpp>

namespace samchon
{
	/* --------------------------------------------------------
		CONSTRUCTORS
	-------------------------------------------------------- */
	WUser::BasicUser(const WServer *server, const pair<wstring, wstring> &ipPair)
		: super()
	{
		this->server = server;
		this->ipPair = ipPair;

		sequence = 1;
		id = L"guest";
		authority = 1;
	}
	template<> WUser::~BasicUser() 
	{
	}

	template<> auto WUser::__keepAlive(WClient *client) -> WUserClientPair
	{
		return WUserClientPair(this, client);
	}
	template<> void WUser::setMember(const wstring &id, long authority)
	{
		this->id = id;
		this->authority = authority;
	}

	/* --------------------------------------------------------
		GETTERS
	-------------------------------------------------------- */
	template<> auto WUser::getServer() const -> const WServer*
	{
		return server;
	}
	template<> auto WUser::getIPPair() const -> pair<wstring, wstring>
	{
		return ipPair;
	}
	template<> auto WUser::getID() const -> wstring
	{
		return id;
	}
	template<> auto WUser::getAuthority() const -> long
	{
		return authority;
	}

	/* --------------------------------------------------------
		MANAGING CLIENT
	-------------------------------------------------------- */
	template<> void WUser::addClient(void *socket)
	{
		mtx.lock();
		SmartPointer<WClient> client( createClient(++sequence, socket) );
		this->set(sequence, client);
		mtx.unlock();

		client->listen();
		eraseClient(client->getNo());
	}
	template<> void WUser::eraseClient(long no)
	{
		auto &ucPair = __keepAlive();

		Sleep(15 * 1000);
		mtx.lock();
		{
			erase(no);
			if (size() == 0)
				((WServer*)server)->eraseUser(this->ipPair);
		}
		mtx.unlock();
	}

	/* --------------------------------------------------------
		AUTHENTIFICATION
	-------------------------------------------------------- */
	template<> void WUser::goLogin(WClient *client, shared_ptr<WInvoke> invoke)
	{
		KEEP_USER_ALIVE;
		bool result = doLogin(invoke);

		shared_ptr<WInvoke> reply(new WInvoke(L"handleLogin"));
		reply->add(L"result", L"bool", to_wstring(result));

		client->sendData(reply);
	}
	template<> void WUser::goJoin(WClient *client, shared_ptr<WInvoke> invoke)
	{
		KEEP_USER_ALIVE;
		bool result = doJoin(invoke);

		shared_ptr<WInvoke> reply(new WInvoke(L"handleJoin"));
		reply->add(L"result", L"bool", to_wstring(result));

		client->sendData(reply);
	}
	template<> void WUser::goLogout(WClient *client)
	{
		shared_ptr<WInvoke> invoke(new WInvoke(L"doLogout"));
		for (auto it = begin(); it != end(); it++)
			if (it->second.get() == client)
				continue;
			else
				it->second->sendData(invoke);

		id = L"guest";
		authority = 0;

		clear();
	}
};