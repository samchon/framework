#include <samchon/EntityArray.hpp>

#include <samchon/XML.hpp>

namespace samchon
{
	WEntityArray::BasicEntityArray()
		: WEntity(), WVectorDict<WEntity>() {}
	template<> void WEntityArray::construct(shared_ptr<WXML> xml)
	{
		clear();
		if (xml->has(child_tag()) == false)
			return;

		shared_ptr<WXMLList> xmlList = xml->get(child_tag());
		this->reserve(xmlList->size());

		for (size_t i = 0; i < xmlList->size(); i++)
		{
			shared_ptr<WXML> xmlElement = xmlList->at(i);
			if (isEmpty(xmlElement) == true)
				continue;

			WEntity *entity = createChild();
			entity->construct(xmlList->at(i));

			push_back(entity);
		}
	}

	template<> auto WEntityArray::isEmpty(shared_ptr<WXML> xml) const -> bool
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

	template<> auto WEntityArray::toXML() const -> shared_ptr<WXML>
	{
		shared_ptr<WXML> xml(new WXML());
		xml->setKey(tag());

		shared_ptr<WXMLList> xmlList(new WXMLList());
		xmlList->assign(size(), nullptr);

		for (size_t i = 0; i < size(); i++)
			xmlList->at(i) = at(i)->toXML();

		xml->set(child_tag(), xmlList);
		return xml;
	}
};