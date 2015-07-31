#include <samchon/protocol/ExternalServerArray.hpp>
#include <samchon/protocol/ExternalServer.hpp>
#include <samchon/protocol/ExternalServerRole.hpp>

#include <samchon/library/XML.hpp>
#include <samchon/library/SQLi.hpp>
#include <samchon/library/SQLStatement.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

auto ExternalServerArray::TAG() const -> String
{
	return _T("serverArray");
}
auto ExternalServerArray::CHILD_TAG() const -> String
{
	return _T("server");
}

ExternalServerArray::ExternalServerArray(IProtocol *protocol)
	: super(),
	IProtocol()
{
	this->parent = protocol;
}

void ExternalServerArray::connect()
{
	for (size_t i = 0; i < size(); i++)
		at(i)->connect();
}

/* ----------------------------------------------------------------
	ELEMENT ACCESSOR
---------------------------------------------------------------- */
SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(ExternalServerArray, ExternalServer)
auto ExternalServerArray::hasRole(const String &key) const -> bool
{
	for (size_t i = 0; i < size(); i++)
		if (at(i)->has(key) == true)
			return true;

	return false;
}
auto ExternalServerArray::getRole(const String &key) const->ExternalServerRole*
{
	for (size_t i = 0; i < size(); i++)
		if (at(i)->has(key) == true)
			return at(i)->get(key);

	throw "out of range";
}

/* ----------------------------------------------------------------
	PROTOCOL
---------------------------------------------------------------- */
void ExternalServerArray::replyData(shared_ptr<Invoke> invoke)
{
	parent->replyData(invoke);
}