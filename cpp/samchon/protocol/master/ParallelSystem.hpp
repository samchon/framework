#pragma once
#include <samchon/protocol/master/DistributedSystem.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ParallelSystemArray;

			class SAMCHON_FRAMEWORK_API ParallelSystem
				: public virtual DistributedSystem
			{
			private:
				typedef DistributedSystem super;

			public:
				ParallelSystem(ParallelSystemArray*);
				virtual ~ParallelSystem() = default;

			public:
				void sendData(std::shared_ptr<Invoke>, size_t beginX, size_t endX);
				void sendData(std::shared_ptr<Invoke>, size_t size);
			};
		};
	};
};