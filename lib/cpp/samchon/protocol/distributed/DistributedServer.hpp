#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/distributed/DistributedSystem.hpp>
#include <samchon/protocol/external/ExternalServer.hpp>

namespace samchon
{
namespace protocol
{
namespace distributed
{
	class SAMCHON_FRAMEWORK_API DistributedServer
		: public DistributedSystem,
		public external::ExternalServer
	{
	public:
		DistributedServer(DistributedSystemArray*);
		virtual ~DistributedServer();
	};
};
};
};