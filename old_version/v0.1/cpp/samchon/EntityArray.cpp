#include <samchon/EntityArray.hpp>

#include <samchon/XML.hpp>

namespace samchon
{
	EntityArray::BasicEntityArray()
		: Entity(), VectorDict<Entity>() {}
	template<> void EntityArray::construct(shared_ptr<XML> xml)
	{
		clear();
		if (xml->has(child_tag()) == false)
			return;

		shared_ptr<XMLList> xmlList = xml->get(child_tag());
		this->reserve(xmlList->size());

		for (size_t i = 0; i < xmlList->size(); i++)
		{
			shared_ptr<XML> xmlElement = xmlList->at(i);
			if (isEmpty(xmlElement) == true)
				continue;

			Entity *entity = createChild();
			entity->construct(xmlList->at(i));

			push_back(entity);
		}
	}

	template<> auto EntityArray::isEmpty(shared_ptr<XML> xml) const -> bool
	{
		if (xml->propertySize() > 0)
			return false;
		else
			for (auto listIt = xml->begin(); listIt != xml->end(); listIt++)
				for (auto xmlIt = listIt->second->begin(); xmlIt != listIt->second->end(); xmlIt++)
					if (isEmpty(*xmlIt) == false)
						return false;

		return true;
	}

	template<> auto EntityArray::toXML() const -> shared_ptr<XML>
	{
		shared_ptr<XML> xml(new XML());
		xml->setKey(tag());

		shared_ptr<XMLList> xmlList(new XMLList());
		xmlList->assign(size(), nullptr);

		for (size_t i = 0; i < size(); i++)
			xmlList->at(i) = at(i)->toXML();

		xml->set(child_tag(), xmlList);
		return xml;
	}
};