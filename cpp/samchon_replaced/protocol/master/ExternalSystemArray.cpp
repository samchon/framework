#include <samchon/protocol/master/ExternalSystemArray.hpp>
#	include <samchon/protocol/master/ExternalSystem.hpp>
#	include <samchon/protocol/master/ExternalSystemRole.hpp>

#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::protocol::master;

//XML TAG
auto ExternalSystemArray::TAG() const -> String { return _T("systemArray"); }
auto ExternalSystemArray::CHILD_TAG() const -> String { return _T("system"); }

/* --------------------------------------------------------------
	CONSTRUCTOR
-------------------------------------------------------------- */
ExternalSystemArray::ExternalSystemArray(IProtocol *parent)
	: super(),
	IProtocol()
{
	this->parent = parent;
}

/* --------------------------------------------------------------
	ACCESSORS
-------------------------------------------------------------- */
SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(ExternalSystemArray, ExternalSystem)
auto ExternalSystemArray::hasRole(const String &key) const -> bool
{
	return roleMap.has(key);
}
auto ExternalSystemArray::getRole(const String &key) const -> ExternalSystemRole*
{
	return roleMap.get(key);
}

/* --------------------------------------------------------------
	MESSAGE CHAINING
-------------------------------------------------------------- */
void ExternalSystemArray::sendData(shared_ptr<Invoke> invoke)
{
	String &listener = invoke->getListener();
	bool roleFlag = false;

	for (auto it = roleMap.begin(); it != roleMap.end(); it++)
		if (it->second->hasListener(listener) == true)
		{
			it->second->getSystem()->sendData(invoke);
			roleFlag = true;
		}
	if(roleFlag == false)
		for (size_t i = 0; i < size(); i++)
			at(i)->sendData(invoke);
}