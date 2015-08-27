#pragma once
#include <samchon\API.hpp>

#include <samchon/protocol/SharedEntityArray.hpp>
#include <samchon/protocol/IProtocol.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ExternalSystemArray;
			class ExternalSystemRole;

			/**
			 * @brief An external system
			 *
			 * @author Jeongho Nam
			 */
			class SAMCHON_FRAMEWORK_API ExternalSystem
				: public virtual SharedEntityArray,
				public virtual IProtocol
			{
			private:
				typedef SharedEntityArray super;

			protected:
				virtual auto TAG() const -> String;
				virtual auto CHILD_TAG() const -> String;

				/**
				 * @brief IP address of external system
				 */
				String ip;
				
				/**
				 * @brief Port number associated with external system
				 */
				int port;

			protected:
				/**
				 * @brief parent, the manager ExternalSystemArray
				 */
				ExternalSystemArray *systemArray;

			public:
				/**
				 * @brief Construct from parent
				 *
				 * @param systemArray Parent manager
				 */
				ExternalSystem(ExternalSystemArray*);
				virtual ~ExternalSystem() = default;

				/**
				 * @brief Start interaction
				 */
				virtual void start() = NULL;

				SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(ExternalSystemRole)
				auto getSystemArray() const -> ExternalSystemArray*;
				auto getIP() const -> String;
				auto getPort() const -> int;

			public:
				/**
				 * @brief Handling replied message from external system
				 *
				 * @param invoke Replied invoke message
				 */
				virtual void replyData(std::shared_ptr<Invoke>);

				/**
				 * @brief 
				 */
				virtual auto toXML() const -> std::shared_ptr<library::XML>;
			};
		};
	};
};