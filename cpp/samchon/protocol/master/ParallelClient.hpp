#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/master/ParallelSystem.hpp>
#include <samchon/protocol/ExternalClient.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			/**
			 * @brief A network driver for a parallel client.
			 *
			 * @details 
			 * <p> ParallelClient is an ParallelSystem specialized in client driver. </p>
			 *
			 * \par [Inherited]
			 *		@copydetails master::ParallelSystem
			 */
			class SAMCHON_FRAMEWORK_API ParallelClient
				: public virtual ParallelSystem,
				public virtual ExternalClient
			{
			public:
				/**
				 * @brief Default Constructor.
				 */
				ParallelClient();
				virtual ~ParallelClient() = default;
			};
		};
	};
};