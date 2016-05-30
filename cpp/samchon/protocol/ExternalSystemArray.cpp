#include <samchon/protocol/ExternalSystemArray.hpp>

#include <samchon/protocol/ExternalSystem.hpp>
#include <samchon/protocol/ExternalSystemRole.hpp>
#include <samchon/protocol/SystemRole.hpp>

#include <thread>
#include <samchon/library/XML.hpp>
#include <samchon/protocol/Invoke.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::protocol;

/* ------------------------------------------------------------------
	CONSTRUCTORS
------------------------------------------------------------------ */
ExternalSystemArray::ExternalSystemArray()
	: super()
{
}

/* ------------------------------------------------------------------
	GETTERS
------------------------------------------------------------------ */
auto ExternalSystemArray::hasRole(const std::string &name) const -> bool
{
	for(size_t i = 0; i < size(); i++)
		if (at(i)->has(name) == true)
			return true;
	
	return false;
}
auto ExternalSystemArray::getRole(const std::string &name) const -> shared_ptr<ExternalSystemRole>
{
	for(size_t i = 0; i < size(); i++)
		if (at(i)->has(name) == true)
			return at(i)->get(name);

	throw exception("out of range");
}

/* ------------------------------------------------------------------
	CHAIN OF INVOKE MESSAGE
------------------------------------------------------------------ */
void ExternalSystemArray::sendData(shared_ptr<Invoke> invoke)
{
	bool has = false;

	for(size_t i = 0; i < size(); i++)
		for(size_t j = 0; j < at(i)->size(); j++)
			if (at(i)->at(j)->hasSendListener(invoke->getListener()) == true)
			{
				thread(&ExternalSystemRole::sendData, at(i)->at(j).get(), invoke).detach();
				has = true;
			}

	if(has == true)
		return;

	for(size_t i = 0; i < size(); i++)
		for(size_t j = 0; j < at(i)->size(); j++)
			thread(&ExternalSystemRole::sendData, at(i)->at(j).get(), invoke).detach();
}
void ExternalSystemArray::replyData(shared_ptr<Invoke>)
{
	//NOTHING'S DEFINED
}

/* ------------------------------------------------------------------
	XML TAG
------------------------------------------------------------------ */
auto ExternalSystemArray::TAG() const -> string
{
	return "systemArray";
}
auto ExternalSystemArray::CHILD_TAG() const -> string
{
	return "system";
}