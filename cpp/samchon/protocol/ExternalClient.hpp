#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/ExternalSystem.hpp>
#include <samchon/protocol/IClient.hpp>

namespace samchon
{
	/**
	 * @brief A network driver for an external client.
	 *
	 * @details 
	 * <p> ExternalClient is an ExternalSystem specialized in client driver. </p>
	 *
	 * \par Inherited
	 *		@copydoc protocol::ExternalSystem
	 */
	namespace protocol
	{
		class ExternalClientArray;

		class SAMCHON_FRAMEWORK_API ExternalClient
			: public virtual ExternalSystem,
			public virtual IClient
		{
			friend class ExternalClientArray;

		private:
			typedef ExternalSystem super;

		public:
			/**
			 * @brief Default Constructor.
			 */
			ExternalClient();
			virtual ~ExternalClient() = default;

			virtual void start() override;
		};
	};
};