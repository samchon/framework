#pragma once
#include <samchon/protocol/Entity.hpp>
#include <samchon/protocol/IEntityGroup.hpp>
#include <vector>

#include <samchon/library/XML.hpp>
#include <memory>

namespace samchon
{
	namespace protocol
	{
		template <typename _Ty>
		class EntityArray
			: public virtual Entity,
			public std::vector<_Ty>, public virtual IEntityGroup
		{
		public:
			EntityArray();
			virtual ~EntityArray() = default;

			virtual void construct(std::shared_ptr<library::XML> xml)
			{
				clear();
				if (xml->has(CHILD_TAG()) == false)
					return;

				std::shared_ptr<library::XMLList> &xmlList = xml->get(CHILD_TAG());
				assign(xmlList->size());

				for (size_t i = 0; i < xmlList->size(); i++)
				{
					std::shared_ptr<library::XML> &xmlElement = xmlList->at(i);

					at(i).construct(xmlList->at(i));
;				}
			}

			virtual auto toXML() const -> std::shared_ptr<library::XML>
			{

			};
		};
	};
};