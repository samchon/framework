#pragma once
#include <samchon/protocol/master/MediatorSocket.hpp>
#include <samchon/protocol/ServerConnector.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ExternalClientArrayMediator;

			class SAMCHON_FRAMEWORK_API MediatorClientSocket
				: public MediatorSocket,
				public virtual ServerConnector
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