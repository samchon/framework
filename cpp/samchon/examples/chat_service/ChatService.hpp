#pragma once
#include <samchon/protocol/service/Service.hpp>

namespace samchon
{
	namespace example
	{
		namespace chat_service
		{
			class ChatRoom;

			class ChatService
				: public protocol::service::Service
			{
			private:
				typedef protocol::service::Service super;

				ChatRoom *room;

			public:
				ChatService(protocol::service::Client*);
				virtual ~ChatService() = default;

				virtual void replyData(std::shared_ptr<protocol::Invoke>) override;
			};
		};
	};
};