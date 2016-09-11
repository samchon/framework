#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/distributed/DistributedSystemArray.hpp>
#include <samchon/protocol/external/ExternalServerArray.hpp>

namespace samchon
{
namespace protocol
{
namespace distributed
{
	class DistributedServerArray
		: public DistributedSystemArray,
		public external::ExternalServerArray
	{
	public:
		DistributedServerArray()
			: DistributedSystemArray(),
			external::ExternalServerArray()
		{
		};
		virtual ~DistributedServerArray() = default;
	};
};
};
};