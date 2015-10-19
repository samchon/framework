#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/slave/SlaveSystem.hpp>
#include <samchon/protocol/ExternalClient.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace slave
		{
			/**
			 * @brief A slave client.
			 *
			 * @details 
			 * <p> SlaveClient is a SlaveSystem specialized in client driver. </p>
			 *
			 * \par [Inherited]
			 *		@copydetails slave::SlaveSystem
			 */
			class SAMCHON_FRAMEWORK_API SlaveClient
				: public virtual SlaveSystem,
				public virtual ExternalClient
			{
			protected:
				typedef SlaveSystem super;
				typedef ExternalClient network_super;

			public:
				/**
				 * @brief Default Constructor.
				 */
				SlaveClient();
				virtual ~SlaveClient() = default;
			};
		};
	};
};