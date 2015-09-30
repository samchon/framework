#include <samchon/protocol/ExternalSystemRole.hpp>
#include <samchon/protocol/ExternalSystem.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;

/* ------------------------------------------------------------------
	CONSTRUCTORS
------------------------------------------------------------------ */
ExternalSystemRole::ExternalSystemRole(ExternalSystem *system)
	: super()
{
	this->system = system;
}

void ExternalSystemRole::construct(shared_ptr<XML> xml)
{
	name = xml->getProperty("name");

	constructListeners( sendListeners,  xml->get("sendListeners")->at(0)  );
	constructListeners( replyListeners, xml->get("replyListeners")->at(0) );
}
void ExternalSystemRole::constructListeners(set<string> &listenerSet, shared_ptr<XML> xml)
{
	listenerSet.clear();
	if(xml->has("listener") == false)
		return;

	shared_ptr<XMLList> &xmlList = xml->get("listener");
	for (size_t i = 0; i < xmlList->size(); i++)
		listenerSet.insert( xmlList->at(i)->getValue() );
}

/* ------------------------------------------------------------------
	GETTERS
------------------------------------------------------------------ */
auto ExternalSystemRole::getSystem() const -> ExternalSystem*
{
	return system;
}
auto ExternalSystemRole::key() const -> string
{
	return name;
}

auto ExternalSystemRole::hasSendListener(const string &key) const -> bool
{
	return sendListeners.count(key) >= 1;
}
auto ExternalSystemRole::hasReplyListener(const string &key) const -> bool
{
	return replyListeners.count(key) >= 1;
}

/* ------------------------------------------------------------------
	CHAIN OF INVOKE MESSAGE
------------------------------------------------------------------ */
void ExternalSystemRole::sendData(shared_ptr<Invoke> invoke)
{
	system->sendData(invoke);
}

/* ------------------------------------------------------------------
	EXPORTERS
------------------------------------------------------------------ */
auto ExternalSystemRole::TAG() const -> string
{
	return "role";
}

auto ExternalSystemRole::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("name", name);

	xml->push_back( toListenersXML(sendListeners,  "sendListeners")  );
	xml->push_back( toListenersXML(replyListeners, "replyListeners") );

	return xml;
}
auto ExternalSystemRole::toListenersXML(const set<string> &listenerSet, const string &tag) const -> shared_ptr<XML>
{
	shared_ptr<XML> xml(new XML());
	xml->setTag(tag);

	for (auto it = listenerSet.begin(); it != listenerSet.end(); it++)
	{
		shared_ptr<XML> listener(new XML());
		listener->setTag("listener");
		listener->setValue(*it);

		xml->push_back(listener);
	}
	return xml;
}