#include <samchon/namtree/NTParameter.hpp>
#	include <samchon/namtree/NTParameterDetermined.hpp>

#include <samchon/library/XML.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::namtree;

auto NTParameter::TAG() const -> String { return _T("parameter"); }
auto NTParameter::CHILD_TAG() const -> String { return _T("parameterDetermined"); }

NTParameter::NTParameter()
	: super(), INTExplore()
{
	initialValue = NUM_NULL;
}
void NTParameter::construct(shared_ptr<XML> xml)
{
	super::construct(xml);
	INTExplore::construct(xml);

	name = xml->getProperty(_T("name"));
	if (xml->hasProperty(_T("initialValue")))
		initialValue = xml->getProperty<double>(_T("initialValue"));
	else
		initialValue = NUM_NULL;
}
auto NTParameter::createChild(shared_ptr<XML>) -> Entity*
{
	return new NTParameterDetermined();
}

SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(NTParameter, NTParameterDetermined)
auto NTParameter::key() const -> String
{
	return name;
}
auto NTParameter::getName() const -> String
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

	xml->setProperty(_T("name"), name);
	if (initialValue != NUM_NULL)
		xml->setProperty(_T("initialValue"), initialValue);
	
	return xml;
}