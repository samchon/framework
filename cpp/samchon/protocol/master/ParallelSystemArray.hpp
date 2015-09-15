#pragma once
#include <samchon/protocol/master/DistributedSystemArray.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class  ParallelMaster
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