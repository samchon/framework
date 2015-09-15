#pragma once


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
			class  ExternalSystem
				: public virtual SharedEntityArray,
				public virtual IProtocol
			{
			private:
				typedef SharedEntityArray super;

			protected:
				virtual auto TAG() const -> std::string;
				virtual auto CHILD_TAG() const -> std::string;

				/**
				 * @brief IP address of external system
				 */
				std::string ip;
				
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

			public:
				/**
				 * @brief Handling replied message from an external system
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