#pragma once
#include <samchon/protocol/IProtocol.hpp>

#include <string>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ExternalSystemArrayMediator;

			class  MediatorSocket
				: public virtual IProtocol
			{
				friend class ExternalSystemArrayMediator;

			private:
				typedef IProtocol super;

			protected:
				ExternalSystemArrayMediator *mediator;
				std::string ip;
				int port;

			public:
				MediatorSocket(ExternalSystemArrayMediator*);
				virtual ~MediatorSocket() = default;

				virtual void start() = NULL;
				virtual void replyData(std::shared_ptr<Invoke>);
			};
		};
	};
};