#pragma once
#include <samchon/protocol/Entity.hpp>
#include <samchon/protocol/IProtocol.hpp>

#include <string>
#include <samchon/library/CriticalSet.hpp>


namespace samchon
{
	namespace example
	{
		namespace chat_service
		{
			class ChatUser;
			class ChatService;

			class ChatRoomArray;

			class ChatRoom
				: public protocol::Entity,
				public protocol::IProtocol
			{
			protected:
				typedef protocol::Entity super;

				virtual auto TAG() const -> std::string { return "room"; };

			private:
				ChatRoomArray *roomArray;

				std::string name;
				ChatUser *host;
				library::CriticalSet<ChatService*> participants;

			public:
				/* -----------------------------------------------------------
					CONSTRUCTORS
				----------------------------------------------------------- */
				ChatRoom(ChatRoomArray*, const std::string &, ChatUser*);
				virtual ~ChatRoom() = default;
				
				void registerClient(ChatService*);
				void eraseClient(ChatService*);

				/* -----------------------------------------------------------
					CHAIN OF RESPONSIBILITY
				----------------------------------------------------------- */
				virtual void replyData(std::shared_ptr<protocol::Invoke>) override;
				virtual void sendData(std::shared_ptr<protocol::Invoke>) override;	

			public:
				/* -----------------------------------------------------------
					GETTERS
				----------------------------------------------------------- */
				virtual auto toXML() const -> std::shared_ptr<library::XML> override;
			};
		};
	};
};