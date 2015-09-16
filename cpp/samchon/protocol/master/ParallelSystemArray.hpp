#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/master/DistributedSystemArray.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class SAMCHON_FRAMEWORK_API ParallelMaster
				: public virtual DistributedSystemArray
			{
			private:
				typedef DistributedSystemArray super;

			public:
				ParallelMaster(IProtocol*);
				virtual ~ParallelMaster() = default;

				void sendDataSeparately(std::shared_ptr<Invoke>);
			};
		};
	};
};