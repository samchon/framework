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

	name = xml->get_property("name");
	if (xml->has_property("initialValue"))
		initialValue = xml->get_property<double>("initialValue");
	else
		initialValue = INT_MIN;
}
auto NTParameter::create_child(shared_ptr<XML>) -> NTParameterDetermined*
{
	return new NTParameterDetermined();
}

auto NTParameter::key() const -> string
{
	return name;
}
auto NTParameter::get_name() const -> string
{
	return name;
}
auto NTParameter::getInitialValue() const -> double
{
	return initialValue;
}

auto NTParameter::to_XML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::to_XML();
	xml->add_all_properties(INTExplore::to_XML());

	xml->set_property("name", name);
	if (initialValue != INT_MIN)
		xml->set_property("initialValue", initialValue);
	
	return xml;
}