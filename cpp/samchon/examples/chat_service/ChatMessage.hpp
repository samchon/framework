#pragma once
#include <set>

#include <samchon/protocol/Entity.hpp>

namespace samchon
{
	namespace example
	{
		namespace chat_service
		{
			class ChatMessage
				: public protocol::Entity
			{
			protected:
				typedef protocol::Entity super;

				virtual auto TAG() const -> std::string
				{
					return "message";
				};

			private:
				std::string orator;
				std::string listener;
				std::string message;

			public:
				/* -----------------------------------------------------------
					CONSTRUCTORS
				----------------------------------------------------------- */
				ChatMessage();
				virtual ~ChatMessage() = default;

				virtual void construct(std::shared_ptr<library::XML>);

				/* -----------------------------------------------------------
					GETTERS
				----------------------------------------------------------- */
				auto getListener() const -> std::string;
				virtual auto toXML() const -> std::shared_ptr<library::XML>;
			};
		};
	};
};