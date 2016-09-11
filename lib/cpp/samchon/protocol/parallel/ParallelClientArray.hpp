#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/parallel/ParallelSystemArray.hpp>
#include <samchon/protocol/external/ExternalClientArray.hpp>

namespace samchon
{
namespace protocol
{
namespace parallel
{
	class ParallelClientArray
		: public ParallelSystemArray,
		public external::ExternalClientArray
	{
	public:
		ParallelClientArray()
			: ParallelSystemArray(),
			external::ExternalClientArray()
		{
		};
		virtual ~ParallelClientArray() = default;
	};
};
};
};