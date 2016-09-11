#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/distributed/DistributedSystemArray.hpp>
#include <samchon/protocol/external/ExternalServerClientArray.hpp>

namespace samchon
{
namespace protocol
{
namespace distributed
{
	class DistributedServerClientArray
		: public DistributedSystemArray,
		public external::ExternalServerClientArray
	{
	public:
		DistributedServerClientArray()
			: DistributedSystemArray(),
			external::ExternalServerClientArray()
		{
		};
		virtual ~DistributedServerClientArray() = default;
	};
};
};
};