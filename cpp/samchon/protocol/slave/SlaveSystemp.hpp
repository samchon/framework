#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/ExternalSystem.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace slave
		{
			/**
			 * @brief A slave system
			 *
			 * @details
			 * 
			 * \par Inherited
			 *		@copydoc protocol::ExternalSystem
			 */
			class SAMCHON_FRAMEWORK_API SlaveSystem
				: public virtual ExternalSystem
			{
			public:
				/**
				 * @brief Default Constructor.
				 */
				SlaveSystem();
				virtual ~SlaveSystem() = default;

			protected:
				/**
				 * @brief Pre-process for report elapsed time
				 *
				 * @details
				 * <p> </p>
				 *
				 * \par Inherited
				 *		@copydoc IClient::_replyData()
				 */
				virtual void _replyData(std::shared_ptr<Invoke>) override;
			};
		};
	};
};