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
		 * Entity is a standard data class in Samchon Framework<br/>
		 * Entity provides converting methods between XML
		 * 
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API Entity
		{
		public:
			/**
			 * A tag name when converted to XML<br/>
			 * <u>&lt;TAG /&gt;</u>
			 */
			virtual auto TAG() const -> String = NULL;
			
			/**
			 * An identifier of Entity<br/>
			 * If the key is not atomic or not string, then make an artificial(surrogate) key
			 */
			virtual auto key() const -> String;

		public:
			Entity();
			virtual ~Entity() = default;
			
			/**
			 * <u>XML -> Entity</u>
			 * Constructs data of Entity by XML
			 *
			 * @param xml Contains the data of Entity.
			 */
			virtual void construct(std::shared_ptr<library::XML> xml) = NULL;

			/**
			 * <u>Entity -> XML</u><br>
			 * Converts data of the Entity to XML
			 *
			 * @return XML contaning data of the Entity
			 */
			virtual auto toXML() const -> std::shared_ptr<library::XML> = NULL;
		};
	};
};