#include <samchon/UserClientPair.hpp>
#include <samchon/User.hpp>
#include <samchon/Client.hpp>

#include <samchon/SmartPointer.hpp>

namespace samchon
{
	WUserClientPair::BasicUserClientPair(WUser *user, WClient *client)
	{
		this->user.reset(user);
		this->client.reset(client);
	}
	WUserClientPair::BasicUserClientPair(const WUserClientPair &pair)
	{
		user.reset(pair.user.get());
		client.reset(pair.client.get());
	}
	WUserClientPair::BasicUserClientPair(WUserClientPair &&pair)
	{
		user.reset(pair.user.get());
		client.reset(pair.client.get());
	}
};