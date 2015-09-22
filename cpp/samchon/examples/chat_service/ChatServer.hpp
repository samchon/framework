#pragma once
#include <samchon/protocol/service/Server.hpp>

namespace samchon
{
	namespace example
	{
		namespace chat_service
		{
			class ChatRoomArray;
			class ChatRoom;

			class ChatServer
				: public protocol::service::Server
			{
			protected:
				typedef protocol::service::Server super;

				virtual auto PORT() const -> int override
				{
					return 37749;
				};

			private:
				ChatRoomArray *roomArray;

			public:
				ChatServer();
				virtual ~ChatServer();

			protected:
				virtual auto createUser() -> protocol::service::User* override;

			public:
				auto getChatRoomArray() const -> ChatRoomArray*;
				auto getChatRoom(const std::string &) const -> ChatRoom*;
				
				void eraseChatRoom(const std:: string &);
			};
		};
	};
};