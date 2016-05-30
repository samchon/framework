#include <samchon/protocol/master/DistributedSystemArray.hpp>

#include <samchon/protocol/master/DistributedSystem.hpp>
#include <samchon/protocol/master/DistributedSystemRole.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

/* ------------------------------------------------------------------
	CONSTRUCTORS
------------------------------------------------------------------ */
DistributedSystemArray::DistributedSystemArray()
	: super()
{

}
void DistributedSystemArray::construct(shared_ptr<XML> xml)
{
	super::construct(xml);
	
	if (xml->has("roleArray") == false)
		return;

	shared_ptr<XMLList> &xmlList = xml->get("roleArray")->at(0)->get("role");
	for (size_t i = 0; i < xmlList->size(); i++)
	{
		shared_ptr<DistributedSystemRole> role( createRole(xmlList->at(i)) );
		role->construct(xmlList->at(i));

		roleDictionary.set(role->key(), role);
	}
}

/* ------------------------------------------------------------------
	PROCESS
------------------------------------------------------------------ */
void DistributedSystemArray::start()
{
	allocateRoles();
}
void DistributedSystemArray::allocateRoles()
{

}

/* ------------------------------------------------------------------
	GETTERS
------------------------------------------------------------------ */
SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(DistributedSystemArray, DistributedSystem)

auto DistributedSystemArray::hasRole(const string &key) const -> bool
{
	return roleDictionary.has(key);
}
auto DistributedSystemArray::getRole(const string &key) const -> shared_ptr<DistributedSystemRole>
{
	return roleDictionary.get(key);
}

/* ------------------------------------------------------------------
	EXPORTERS
------------------------------------------------------------------ */
auto DistributedSystemArray::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();

	if (roleDictionary.empty() == true)
		return xml;

	shared_ptr<XML> roleArray(new XML());
	xml->setTag("roleArray");

	for (auto it = roleDictionary.begin(); it != roleDictionary.end(); it++)
		roleArray->push_back(it->second->toXML());

	xml->push_back(roleArray);

	return xml;
}