#pragma once
#include <samchon/protocol/master/MediatorSocket.hpp>
#include <samchon/protocol/IServerConnector.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ExternalClientArrayMediator;

			class SAMCHON_FRAMEWORK_API MediatorClientSocket
				: public MediatorSocket,
				public virtual IServerConnector
			{
			private:
				typedef MediatorSocket super;

			protected:
				virtual auto IP() const -> String;
				virtual auto MY_IP() const -> String;
				virtual auto PORT() const -> int;

			public:
				MediatorClientSocket(ExternalClientArrayMediator*);
				virtual ~MediatorClientSocket() = default;

				virtual void start();
			};
		};
	};
};