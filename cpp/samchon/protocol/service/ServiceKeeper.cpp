#include <samchon/protocol/service/ServiceKeeper.hpp>
#	include <samchon/protocol/service/User.hpp>
#	include <samchon/protocol/service/Client.hpp>

using namespace samchon::protocol;
using namespace samchon::protocol::service;

ServiceKeeper::ServiceKeeper(const User *user, const Client *client)
{
	this->user.reset(user);
	this->client.reset(client);
}
ServiceKeeper::ServiceKeeper(const ServiceKeeper &pair)
{
	this->user.reset(pair.user.get());
	this->client.reset(pair.client.get());
}
ServiceKeeper::ServiceKeeper(ServiceKeeper &&pair)
{
	this->user.reset( pair.user.get() );
	this->client.reset( pair.client.get() );
}