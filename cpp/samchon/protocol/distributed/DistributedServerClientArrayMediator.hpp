#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/distributed/DistributedSystemArrayMediator.hpp>
#include <samchon/protocol/external/ExternalServerClientArray.hpp>

namespace samchon
{
namespace protocol
{
namespace distributed
{
	class DistributedServerClientArrayMediator
		: public DistributedSystemArrayMediator,
		public external::ExternalServerClientArray
	{
	public:
		DistributedServerClientArrayMediator()
			: DistributedSystemArray(),
			external::ExternalServerClientArray()
		{
		};
		virtual ~DistributedServerClientArrayMediator() = default;
	};
};
};
};