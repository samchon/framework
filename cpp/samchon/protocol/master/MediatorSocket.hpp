#pragma once
#include <samchon/protocol/IProtocol.hpp>

#include <samchon/String.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ExternalSystemArrayMediator;

			class SAMCHON_FRAMEWORK_API MediatorSocket
				: public virtual IProtocol
			{
				friend class ExternalSystemArrayMediator;

			private:
				typedef IProtocol super;

			protected:
				ExternalSystemArrayMediator *mediator;
				String ip;
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