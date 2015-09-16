#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/master/Master.hpp>

namespace samchon
{
	namespace protocol
	{
		class MasterProxySocket;

		class SAMCHON_FRAMEWORK_API MasterProxy
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