#pragma once
#include <samchon\API.hpp>

#include <samchon/String.hpp>
#include <memory>

namespace samchon
{
	namespace library
	{
		class XML;
	};
	namespace protocol
	{
		/**
		 * @brief Entity, the standard data class
		 *
		 * @details
		 * 
		 * 
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API Entity
		{
		public:
			/**
			 * @brief A tag name of XML
			 *
			 * @details 
			 */
			virtual auto TAG() const -> String = NULL;
			
			/**
			 * @brief Identifier of the Entity
			 * 
			 * @details
			 * If the key is not atomic or not string, then makes an artificial(surrogate) key
			 */
			virtual auto key() const -> String;

		public:
			/**
			 * @brief Default Constructor.
			 */
			Entity();
			virtual ~Entity() = default;
			
			/**
			 * @brief XML -> Entity
			 * @details Constructs data of Entity by XML
			 *
			 * @param xml A xml used to construct data of entity
			 */
			virtual void construct(std::shared_ptr<library::XML>) = NULL;

			/**
			 * @brief Entity -> XML
			 * @details Converts data of the Entity to XML
			 *
			 * @return XML representing the Entity
			 */
			virtual auto toXML() const -> std::shared_ptr<library::XML> = NULL;
		};
	};
};