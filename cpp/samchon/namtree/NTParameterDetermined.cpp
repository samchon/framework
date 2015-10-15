#include <samchon/namtree/NTParameterDetermined.hpp>

#include <samchon/library/XML.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::namtree;

auto NTParameterDetermined::TAG() const -> string { return "parameterDetermined"; }

NTParameterDetermined::NTParameterDetermined()
	: super()
{
}
void NTParameterDetermined::construct(shared_ptr<XML> xml)
{
	label = xml->getProperty("label");
	value = xml->hasProperty("value")
		? xml->getProperty<double>("value") : INT_MIN;
}

auto NTParameterDetermined::key() const -> string
{
	return label;
}
auto NTParameterDetermined::getLabel() const -> string
{
	return label;
}
auto NTParameterDetermined::getValue() const -> double
{
	return value;
}

auto NTParameterDetermined::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("label", label);
	if(value != INT_MIN)
		xml->setProperty("value", value);

	return xml;
}