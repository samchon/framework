#pragma once
#include <set>
#include <string>

#include <samchon/protocol/Entity.hpp>
#include <samchon/protocol/IProtocol.hpp>

namespace samchon
{
	namespace example
	{
		namespace chat_service
		{
			class ChatUser;
			class ChatService;

			class ChatRoom
				: public protocol::Entity,
				public protocol::IProtocol
			{
			protected:
				typedef protocol::Entity super;

				virtual auto TAG() const -> std::string override
				{
					return "room";
				};

			private:
				std::string name;
				ChatUser *host;
				std::set<ChatService*> participants;

			public:
				/* -----------------------------------------------------------
					CONSTRUCTORS
				----------------------------------------------------------- */
				ChatRoom(const std::string &, ChatUser*);
				virtual ~ChatRoom() = default;

				virtual void construct(std::shared_ptr<library::XML>) override; //=delete

				/* -----------------------------------------------------------
					CHAIN OF RESPONSIBILITY
				----------------------------------------------------------- */
				virtual void replyData(std::shared_ptr<protocol::Invoke>) override {};

				virtual void sendData(std::shared_ptr<protocol::Invoke>) override;
				
				void registerClient(ChatService*);
				void eraseClient(ChatService*);

				/* -----------------------------------------------------------
					GETTERS
				----------------------------------------------------------- */
				virtual auto key() const -> std::string override;
				virtual auto toXML() const -> std::shared_ptr<library::XML> override;
			};
		};
	};
};