#pragma once
#include <samchon/protocol/service/User.hpp>

namespace samchon
{
	namespace example
	{
		namespace chat_service
		{
			class ChatUser
				: public protocol::service::User
			{
			public:
				ChatUser(protocol::service::Server*);
				virtual ~ChatUser() = default;

			protected:
				virtual auto createClient() -> protocol::service::Client* override;
			};
		};
	};
};