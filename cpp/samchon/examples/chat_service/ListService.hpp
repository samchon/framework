#pragma once
#include <samchon/protocol/service/Service.hpp>

namespace samchon
{
	namespace example
	{
		namespace chat_service
		{
			class ListService;

			class ListService
				: public protocol::service::Service
			{
			private:
				typedef protocol::service::Service super;

			public:
				ListService(protocol::service::Client*);
				virtual ~ListService() = default;

				virtual void replyData(std::shared_ptr<protocol::Invoke>) override;

			private:
				void createRoom(const std::string &);
			};
		};
	};
};