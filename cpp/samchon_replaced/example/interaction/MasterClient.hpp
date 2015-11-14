#pragma once
#include <samchon/protocol/master/ParallelClient.hpp>
#include <samchon/protocol/master/ParallelSystemArray.hpp>

#include <samchon/protocol/Invoke.hpp>

#include <iostream>

namespace samchon
{
	namespace example
	{
		namespace interaction
		{
			class MasterClient
				: public virtual protocol::master::ParallelClient
			{
			private:
				typedef protocol::master::ParallelClient super;

			public:
				MasterClient()
					: super()
				{
				};
				virtual ~MasterClient() = default;

				virtual void replyData(std::shared_ptr<protocol::Invoke> invoke) override
				{
					systemArray->replyData(invoke);
				};
			};
		};
	};
};