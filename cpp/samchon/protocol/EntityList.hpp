#pragma once
#include <samchon/protocol/Entity.hpp>
#include <samchon/protocol/IEntityGroup.hpp>
#include <list>

#include <samchon/library/XML.hpp>
#include <memory>

namespace samchon
{
	namespace protocol
	{
		/**
		* @brief A static array of Entity
		*
		* @tparam _Ty Type of children Entity. Must be derived class from the Entity class.
		*/
		template <typename _Ty>
		class EntityList
			: public virtual Entity, public std::list<_Ty>, //CLASSES
			public virtual IEntityGroup //INTERFACE
		{
		private:
			typedef Entity super;

		public:
			/**
			* @brief Default Constructor
			*/
			EntityList();
			virtual ~EntityList() = default;

			virtual void construct(std::shared_ptr<library::XML> xml) override
			{
				clear();
				if (xml->has(CHILD_TAG()) == false)
					return;

				std::shared_ptr<library::XMLList> &xmlList = xml->get(CHILD_TAG());
				assign(xmlList->size());

				for (size_t i = 0; i < xmlList->size(); i++)
					at(i).construct(xmlList->at(i));
			}

			virtual auto toXML() const -> std::shared_ptr<library::XML> override
			{
				std::shared_ptr<library::XML> &xml = super::toXML();

				std::shared_ptr<library::XMLList> xmlList(new XMLList());
				xmlList->reserve(this->size());

				for(size_t i = 0; i < size(); i++)
					xmlList->push_back( at(i).toXML() );

				xml->set(CHILD_TAG(), xmlList);
				return xml;
			};
		};
	};
};