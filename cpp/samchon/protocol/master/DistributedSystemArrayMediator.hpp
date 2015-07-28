#pragma once
#include <samchon/protocol/Master.hpp>

namespace samchon
{
	namespace protocol
	{
		class MasterProxySocket;

		class MasterProxy
			: public virtual Master
		{
		private:
			typedef Master super;

		protected:
			MasterProxySocket *socket;

		public:
			MasterProxy(IProtocol*);
			virtual ~MasterProxy() = default;

			virtual void start();

		protected:
			virtual auto createSocket() -> MasterProxySocket* = NULL;
		};
	};
};