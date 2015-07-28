#pragma once
#include <samchon\API.hpp>

#include <samchon/SmartPointer.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace service
		{
			class User;
			class Client;

			class SAMCHON_FRAMEWORK_API ServiceKeeper
			{
			private:
				SmartPointer<User> user;
				SmartPointer<Client> client;

			public:
				ServiceKeeper(const User *user, const Client *client);
				ServiceKeeper(const ServiceKeeper&);
				ServiceKeeper(ServiceKeeper&&);
			};
		};
	};
};