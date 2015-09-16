#include <samchon/UserClientPair.hpp>
#include <samchon/User.hpp>
#include <samchon/Client.hpp>

#include <samchon/SmartPointer.hpp>

namespace samchon
{
	UserClientPair::BasicUserClientPair(User *user, Client *client)
	{
		this->user.reset(user);
		this->client.reset(client);
	}
	UserClientPair::BasicUserClientPair(const UserClientPair &pair)
	{
		user.reset(pair.user.get());
		client.reset(pair.client.get());
	}
	UserClientPair::BasicUserClientPair(UserClientPair &&pair)
	{
		user.reset(pair.user.get());
		client.reset(pair.client.get());
	}
};