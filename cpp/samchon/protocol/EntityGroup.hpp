#pragma once
#include <samchon/protocol/Entity.hpp>
#include <samchon/protocol/IEntityGroup.hpp>

#include <samchon/library/XML.hpp>

namespace samchon
{
	namespace protocol
	{
		/**
		 * @brief Entity, Container of Entity
		 *
		 * @details
		 * <p> EntityGroup is a container of Entity, and also another type of Entity, too. </p>
		 * Thus, there's a composite relationship between EntityGroup and Entity</br>
		 * \n
		 * @note
		 * <ul>
		 *	<li> When data-set has a "Hierarchical Relationship": </li>
		 *		<p> Compose the data class(entity) having children by inheriting EntityGroup and 
		 *		terminate the leaf node by inheriting Entity </p>
		 *
		 *	<li> Not only hierarchical, but also recursive </li>
		 *		<p> 
		 * 
		 * @author Jeongho Nam
		 */
		template <typename _Container, typename _Ty = _Container::value_type>
		class EntityGroup
			: public _Container,
			public virtual Entity, public virtual IEntityGroup	
		{
		public:
			/**
			 * Constructor
			 */
			EntityGroup()
				: _Container(),
				Entity(), IEntityGroup()
			{};
			virtual ~EntityGroup() = default;
			
			/**
			* Indicates whether a container has an object having the specified identifier.</br>
			* </br>
			* @param key The identifier wants to check
			* @return If there's the object then true, otherwise false
			*/
			auto has(const String &key) const -> bool
			{
				for (auto it = begin(); it != end(); it++)
					if ((*it)->key() == key)
						return true;

				return false;
			};

			/**
			* Access the element by specified identifier(key)\n
			* \n
			* @param key the identifier of the element wants to access
			* @return The element having the key, or throw exception if there is none.
			*/
			auto get(const String &key) -> _Ty&
			{
				for (auto it = begin(); it != end(); it++)
				if ((*it)->key() == key)
					return *it;

				throw "out of range";
			};

			/**
			* Access the const element by specified identifier(key)\n
			* \n
			* @param key the identifier of the element wants to access
			* @return The const element having the key, or throw exception if there is none.
			*/
			auto get(const String &key) const -> const _Ty&
			{
				for (auto it = begin(); it != end(); it++)
					if ((*it)->key() == key)
						return *it;

				throw "out of range";
			};

			/**
			* You don't need to consider the children Entities' members\n
			* Just concentrate on this EntityArray's own members\n
			*
			* @inheritDoc
			*/
			virtual void construct(std::shared_ptr<library::XML> xml)
			{
				clear();
				if (xml->has(CHILD_TAG()) == false)
					return;

				std::shared_ptr<library::XMLList> &xmlList = xml->get(CHILD_TAG());

				if (std::is_same<_Container, std::vector<_Container::value_type, _Container::allocator_type>>::value == true)
				{
					//FOR RESERVE
					assign(xmlList->size(), nullptr);
					erase(begin(), end());
				}

				for (size_t i = 0; i < xmlList->size(); i++)
				{
					std::shared_ptr<library::XML> &xmlElement = xmlList->at(i);

					Entity *entity = createChild(xmlElement);
					if (entity != nullptr)
					{
						entity->construct(xmlList->at(i));
						emplace_back(entity);	
					}
 				}
			};

			/**
			 * You don't need to consider the children Entities' members\n
			 * Just concentrate on this EntityArray's own members\n
			 *
			 * @inheritDoc
			 */
			virtual auto toXML() const -> std::shared_ptr<library::XML>
			{
				std::shared_ptr<library::XML> xml(new library::XML());
				xml->setTag(TAG());
				
				std::shared_ptr<library::XMLList> xmlList(new library::XMLList());
				//xmlList->reserve(size());

				for (auto it = begin(); it != end(); it++)
					xmlList->push_back( (*it)->toXML() );

				xml->set(CHILD_TAG(), xmlList);
 				return xml;
			};

		protected:
			/**
			* Factory method for creating a new child <code>Entity</code> which is belonged to the <code>EntityArray</code>\n
			* This method will be called by construct method (<code>EntityArray::construct(XML)</code>)\n
			* \n
			* @return A new child Entity belongs to EntityGroup
			*/
			virtual auto createChild(std::shared_ptr<library::XML>) -> Entity* = NULL;
	};
};