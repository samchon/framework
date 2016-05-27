#include <samchon/protocol/SystemRole.hpp>

#include <samchon/library/XML.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;

/* ------------------------------------------------------------------
	CONSTRUCTORS
------------------------------------------------------------------ */
SystemRole::SystemRole()
	: super(),
	IProtocol()
{
}
void SystemRole::construct(shared_ptr<XML> xml)
{
	this->name = xml->get_property("name");

	listeners.clear();
	if(xml->has("listenerArray") == false || xml->get("listenerArray")->at(0)->has("listener") == false)
		return;
	
	shared_ptr<XMLList> &xmlList = xml->get("listenerArray")->at(0)->get("listener");
	for(size_t i = 0; i < xmlList->size(); i++)
		listeners.insert(xmlList->at(i)->get_value());
}

/* ------------------------------------------------------------------
	GETTERS
------------------------------------------------------------------ */
auto SystemRole::key() const -> string
{
	return name;
}

auto SystemRole::hasListener(const string &name) const -> bool
{
	return listeners.count(name) >= 1;
}

/* ------------------------------------------------------------------
	EXPORTERS
------------------------------------------------------------------ */
auto SystemRole::TAG() const -> string
{
	return "role";
}

auto SystemRole::to_XML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::to_XML();
	xml->set_property("name", name);

	if (listeners.empty() == false)
	{
		shared_ptr<XML> listenerArray(new XML());
		listenerArray->setTag("listenerArray");

		for (auto it = listeners.begin(); it != listeners.end(); it++)
		{
			shared_ptr<XML> listener(new XML());
			listener->setTag("listener");
			listener->set_value(*it);

			listenerArray->push_back(listener);
		}
		xml->push_back(listenerArray);
	}

	return xml;
}