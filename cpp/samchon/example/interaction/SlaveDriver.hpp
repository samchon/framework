#pragma once
#include <samchon/protocol/master/ParallelClient.hpp>
#include <samchon/protocol/master/ParallelSystemArray.hpp>

#include <samchon/protocol/Invoke.hpp>

#include <iostream>

namespace samchon
{
	namespace example
	{
		/**
		 * @brief A slave system's driver for optimization.
		 * 
		 * @details
		 * \par [Inherited]
		 *		@copydoc master::ParallelClient
		 * 
		 * @author Jeongho Nam
		 */
		class SlaveDriver
			: public virtual protocol::master::ParallelClient
		{
		private:
			typedef protocol::master::ParallelClient super;

		public:
			/**
			 * @brief Default Constructor.
			 */
			SlaveDriver()
				: super()
			{
			};
			virtual ~SlaveDriver() = default;

			virtual void replyData(std::shared_ptr<protocol::Invoke> invoke) override
			{
				systemArray->replyData(invoke);
			};
		};
	};
};