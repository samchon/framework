#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/parallel/ParallelSystemArray.hpp>
#include <samchon/protocol/external/ExternalServerClientArray.hpp>

namespace samchon
{
namespace protocol
{
namespace parallel
{
	class ParallelServerClientArray
		: public ParallelSystemArray,
		public external::ExternalServerClientArray
	{
	public:
		ParallelServerClientArray()
			: ParallelSystemArray(),
			external::ExternalServerClientArray()
		{
		};
		virtual ~ParallelServerClientArray() = default;
	};
};
};
};