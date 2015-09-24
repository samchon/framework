#pragma once
#include <samchon/library/CriticalDictionary.hpp>
#include <samchon/protocol/IEntityGroup.hpp>

namespace samchon
{
	namespace library { class XML; };
	namespace protocol { class Invoke; };

	namespace example
	{
		namespace chat_service
		{
			class ChatRoom;
			
			class ChatServer;
			class ChatUser;

			class ChatRoomArray
				: public CriticalDictionary<std::shared_ptr<ChatRoom>>,
				public protocol::IEntityGroup
			{
			protected:
				typedef CriticalDictionary<std::shared_ptr<ChatRoom>> super;
				
				virtual auto TAG() const -> std::string { return "roomArray"; };
				virtual auto CHILD_TAG() const -> std::string { return "room"; };

			private:
				ChatServer *server;
				
			public:
				/* -----------------------------------------------------------------
					CONSTRUCTORS
				----------------------------------------------------------------- */
				ChatRoomArray(ChatServer*);
				virtual ~ChatRoomArray() = default;
				
				/* -----------------------------------------------------------------
					NOTIFIER
				----------------------------------------------------------------- */
				void notify();

			private:
				/* -----------------------------------------------------------------
					EXPORTERS
				----------------------------------------------------------------- */
				auto toXML() const -> std::shared_ptr<library::XML>;
				auto toInvoke() const -> std::shared_ptr<protocol::Invoke>;
			};
		};
	};
};