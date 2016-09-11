#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/distributed/DistributedSystemArrayMediator.hpp>
#include <samchon/protocol/external/ExternalServerArray.hpp>

namespace samchon
{
namespace protocol
{
namespace distributed
{
	class DistributedServerArrayMediator
		: public DistributedSystemArrayMediator,
		public external::ExternalServerArray
	{
	public:
		DistributedServerArrayMediator()
			: DistributedSystemArrayMediator(),
			external::ExternalServerArray()
		{
		};
		virtual ~DistributedServerArrayMediator() = default;
	};
};
};
};