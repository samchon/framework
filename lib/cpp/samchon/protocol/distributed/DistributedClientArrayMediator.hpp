#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/distributed/DistributedSystemArrayMediator.hpp>
#include <samchon/protocol/external/ExternalClientArray.hpp>

namespace samchon
{
namespace protocol
{
namespace distributed
{
	class DistributedClientArrayMediator
		: public DistributedSystemArrayMediator,
		public external::ExternalClientArray
	{
	public:
		DistributedClientArrayMediator()
			: DistributedSystemArrayMediator(),
			external::ExternalClientArray()
		{
		};
		virtual ~DistributedClientArrayMediator() = default;
	};
};
};
};