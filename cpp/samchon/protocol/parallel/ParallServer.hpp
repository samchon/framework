#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/parallel/ParallelSystem.hpp>
#include <samchon/protocol/external/ExternalServer.hpp>

namespace samchon
{
namespace protocol
{
namespace parallel
{
	class SAMCHON_FRAMEWORK_API ParallelServer
		: public ParallelSystem,
		public external::ExternalServer
	{
	public:
		ParallelServer(ParallelSystemArray*);
		virtual ~ParallelServer();
	};
};
};
};