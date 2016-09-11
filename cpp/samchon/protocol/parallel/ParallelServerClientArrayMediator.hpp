#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/parallel/ParallelSystemArrayMediator.hpp>
#include <samchon/protocol/external/ExternalServerClientArray.hpp>

namespace samchon
{
namespace protocol
{
namespace parallel
{
	class ParallelServerClientArrayMediator
		: public ParallelSystemArrayMediator,
		public external::ExternalServerClientArray
	{
	public:
		ParallelServerClientArrayMediator()
			: ParallelSystemArray(),
			external::ExternalServerClientArray()
		{
		};
		virtual ~ParallelServerClientArrayMediator() = default;
	};
};
};
};