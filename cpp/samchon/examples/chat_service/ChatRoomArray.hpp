#pragma once
#include <samchon/protocol/SharedEntityArray.hpp>

namespace samchon
{
	namespace example
	{
		namespace chat_service
		{
			class ChatServer;
			class ChatRoom;

			class ChatRoomArray
				: public protocol::SharedEntityArray
			{
			protected:
				virtual auto TAG() const -> std::string
				{
					return "roomArray";
				};
				virtual auto CHILD_TAG() const -> std::string
				{
					return "room";
				};

			private:
				ChatServer *server;

			public:
				ChatRoomArray(ChatServer*);
				virtual ~ChatRoomArray() = default;

				virtual auto createChild(std::shared_ptr<library::XML>) -> protocol::Entity* override;

				SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(ChatRoom)
			};
		};
	};
};