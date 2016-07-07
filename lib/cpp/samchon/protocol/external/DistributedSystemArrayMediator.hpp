#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/master/ParallelSystemArray.hpp>

namespace samchon
{
namespace protocol
{
namespace master
{
	class SAMCHON_FRAMEWORK_API ParallelSystemArrayMediator
		: public ParallelSystemArray
	{
	private:
		typedef ParallelSystemArray super;

	public:
		ParallelSystemArrayMediator();
		virtual ~ParallelSystemArrayMediator();
	};
};
};
};