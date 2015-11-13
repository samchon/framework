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
		 * <p> SlaveDriver is a boundary class interacting with a slave system by inheriting 
		 * master::ParallelClient. The SlaveDriver is built for providing a guidance of utilizing slave
		 * driver in master module of protocol. </p>
		 * 		   
		 * <p> @image html  cpp/example_interaction.png
		 *	   @image latex cpp/example_interaction.png </p>
		 * 
		 * <p> @image html  conception/example_interaction.png
		 *	   @image latex conception/example_interaction.png </p>
		 *	   		  
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