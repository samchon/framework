#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/PRInvokeHistory.hpp>

#include <map>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ParallelSystemArray;
			class ParallelSystem;

			class SAMCHON_FRAMEWORK_API PRMasterHistory
				: public PRInvokeHistory
			{
			protected:
				typedef PRInvokeHistory super;

				ParallelSystemArray *systemArray;
				std::map<ParallelSystem*, bool> systemMap;

			public:
				PRMasterHistory(ParallelSystemArray*, std::shared_ptr<Invoke>);
				virtual ~PRMasterHistory() = default;

				void notifyEnd(ParallelSystem*);
			};
		};
	};
};