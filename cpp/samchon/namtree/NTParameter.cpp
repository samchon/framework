#include <samchon/namtree/NTParameter.hpp>
#	include <samchon/namtree/NTParameterDetermined.hpp>

#include <samchon/library/XML.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::namtree;

auto NTParameter::TAG() const -> string { return "parameter"; }
auto NTParameter::CHILD_TAG() const -> string { return "parameterDetermined"; }

NTParameter::NTParameter()
	: super(), INTExplore()
{
	initialValue = INT_MIN;
}
void NTParameter::construct(shared_ptr<XML> xml)
{
	super::construct(xml);
	INTExplore::construct(xml);

	name = xml->getProperty("name");
	if (xml->hasProperty("initialValue"))
		initialValue = xml->getProperty<double>("initialValue");
	else
		initialValue = INT_MIN;
}
auto NTParameter::createChild(shared_ptr<XML>) -> Entity*
{
	return new NTParameterDetermined();
}

SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(NTParameter, NTParameterDetermined)
auto NTParameter::key() const -> string
{
	return name;
}
auto NTParameter::getName() const -> string
{
	return name;
}
auto NTParameter::getInitialValue() const -> double
{
	return initialValue;
}

auto NTParameter::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->addAllProperty(INTExplore::toXML());

	xml->setProperty("name", name);
	if (initialValue != INT_MIN)
		xml->setProperty("initialValue", initialValue);
	
	return xml;
}