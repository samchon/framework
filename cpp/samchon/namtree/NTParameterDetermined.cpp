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
	label = xml->get_property("label");
	value = xml->has_property("value")
		? xml->get_property<double>("value") : INT_MIN;
}

auto NTParameterDetermined::key() const -> string
{
	return label;
}
auto NTParameterDetermined::getLabel() const -> string
{
	return label;
}
auto NTParameterDetermined::get_value() const -> double
{
	return value;
}

auto NTParameterDetermined::to_XML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::to_XML();
	xml->set_property("label", label);
	if(value != INT_MIN)
		xml->set_property("value", value);

	return xml;
}