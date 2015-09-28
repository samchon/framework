#include <samchon/protocol/ExternalSystemArray.hpp>

#include <samchon/protocol/ExternalSystem.hpp>
#include <samchon/protocol/ExternalSystemRole.hpp>

#include <samchon/library/XML.hpp>

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
SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(ExternalSystemArray, ExternalSystem)

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