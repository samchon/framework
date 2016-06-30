#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/ServerConnector.hpp>
#include <samchon/protocol/NormalCommunicator.hpp>

namespace samchon
{
	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API NormalServerConnector
			: public ServerConnector,
			public virtual NormalCommunicator
		{
		private:
			typedef ServerConnector super;

		public:
			NormalServerConnector(IProtocol *listener);
			virtual ~NormalServerConnector();
		};
	};
};