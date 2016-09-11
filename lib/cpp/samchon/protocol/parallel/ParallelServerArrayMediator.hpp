#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/parallel/ParallelSystemArrayMediator.hpp>
#include <samchon/protocol/external/ExternalServerArray.hpp>

namespace samchon
{
namespace protocol
{
namespace parallel
{
	class ParallelServerArrayMediator
		: public ParallelSystemArrayMediator,
		public external::ExternalServerArray
	{
	public:
		ParallelServerArrayMediator()
			: ParallelSystemArrayMediator(),
			external::ExternalServerArray()
		{
		};
		virtual ~ParallelServerArrayMediator() = default;
	};
};
};
};