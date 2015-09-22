#pragma once
#include <samchon/protocol/service/Client.hpp>

namespace samchon
{
	namespace example
	{
		namespace chat_service
		{
			class ChatClient
				: public protocol::service::Client
			{
			public:
				ChatClient(protocol::service::User*);
				virtual ~ChatClient() = default;

			protected:
				auto createService(const std::string &) -> protocol::service::Service* override;
			};
		};
	};
};