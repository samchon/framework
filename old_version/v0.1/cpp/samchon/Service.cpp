#include <samchon/Service.hpp>
#include <samchon/Client.hpp>
#include <samchon/User.hpp>
#include <samchon/Server.hpp>
#include <samchon/UserClientPair.hpp>

#include <samchon/SQLi.hpp>
#include <samchon/SQLStatement.hpp>

namespace samchon
{
	using namespace std;

	/* --------------------------------------------------------
		CONSTRUCTORS
	-------------------------------------------------------- */
	Service::BasicService(const Client *client)
		: super()
	{
		this->client = client;
	}
	template<> Service::~BasicService() {}
	
	template<> auto Service::__keepAlive() -> UserClientPair
	{
		return UserClientPair((User*)getClient()->getUser(), (Client*)getClient());
	}

	/* --------------------------------------------------------
		GETTERS
	-------------------------------------------------------- */
	template<> auto Service::getClient() const -> const Client*
	{
		return client;
	}
	template<> auto Service::getSQLi() const -> SQLi*
	{
		return client->getUser()->getServer()->getSQLi();
	}

	/* --------------------------------------------------------
		SOCKET
	-------------------------------------------------------- */
	template<> void Service::sendData(shared_ptr<Invoke> invoke)
	{
		((Client*)client)->sendData(invoke);
	}
	template<> void Service::sendData(shared_ptr<Invoke> invoke, const vector<unsigned char> &data)
	{
		((Client*)client)->sendData(invoke, data);
	}
	template<> void Service::sendError(const long errorID)
	{
		((Client*)client)->sendError(errorID);
	}
};