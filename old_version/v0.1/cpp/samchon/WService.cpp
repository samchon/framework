#include <samchon/Service.hpp>
#include <samchon/Client.hpp>
#include <samchon/User.hpp>
#include <samchon/Server.hpp>
#include <samchon/UserClientPair.hpp>

#include <samchon/SQLi.hpp>

namespace samchon
{
	using namespace std;

	/* --------------------------------------------------------
		CONSTRUCTORS
	-------------------------------------------------------- */
	WService::BasicService(const WClient *client)
		: super()
	{
		this->client = client;
	}
	template<> WService::~BasicService() {}

	template<> auto WService::__keepAlive() -> WUserClientPair
	{
		return WUserClientPair((WUser*)getClient()->getUser(), (WClient*)getClient());
	}

	/* --------------------------------------------------------
		GETTERS
	-------------------------------------------------------- */
	template<> auto WService::getClient() const -> const WClient*
	{
		return client;
	}
	template<> auto WService::getSQLi() const -> WSQLi*
	{
		return client->getUser()->getServer()->getSQLi();
	}

	/* --------------------------------------------------------
		SOCKET
	-------------------------------------------------------- */
	template<> void WService::sendData(shared_ptr<WInvoke> invoke)
	{
		((WClient*)client)->sendData(invoke);
	}
	template<> void WService::sendData(shared_ptr<WInvoke> invoke, const vector<unsigned char> &data)
	{
		((WClient*)client)->sendData(invoke, data);
	}
	template<> void WService::sendError(const long errorID)
	{
		((WClient*)client)->sendError(errorID);
	}
};