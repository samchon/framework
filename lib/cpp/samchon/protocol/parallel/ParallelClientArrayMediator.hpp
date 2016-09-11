#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/parallel/ParallelSystemArrayMediator.hpp>
#include <samchon/protocol/external/ExternalClientArray.hpp>

namespace samchon
{
namespace protocol
{
namespace parallel
{
	class ParallelClientArrayMediator
		: public ParallelSystemArrayMediator,
		public external::ExternalClientArray
	{
	public:
		ParallelClientArrayMediator()
			: ParallelSystemArrayMediator(),
			external::ExternalClientArray()
		{
		};
		virtual ~ParallelClientArrayMediator() = default;
	};
};
};
};