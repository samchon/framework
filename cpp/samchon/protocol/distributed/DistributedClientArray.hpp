#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/distributed/DistributedSystemArray.hpp>
#include <samchon/protocol/external/ExternalClientArray.hpp>

namespace samchon
{
namespace protocol
{
namespace distributed
{
	class DistributedClientArray
		: public DistributedSystemArray,
		public external::ExternalClientArray
	{
	public:
		DistributedClientArray()
			: DistributedSystemArray(),
			external::ExternalClientArray()
		{
		};
		virtual ~DistributedClientArray() = default;
	};
};
};
};