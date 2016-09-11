#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/parallel/ParallelSystemArray.hpp>
#include <samchon/protocol/external/ExternalServerArray.hpp>

namespace samchon
{
namespace protocol
{
namespace parallel
{
	class ParallelServerArray
		: public ParallelSystemArray,
		public external::ExternalServerArray
	{
	public:
		ParallelServerArray()
			: ParallelSystemArray(),
			external::ExternalServerArray()
		{
		};
		virtual ~ParallelServerArray() = default;
	};
};
};
};