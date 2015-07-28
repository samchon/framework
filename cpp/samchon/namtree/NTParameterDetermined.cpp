#include <samchon/namtree/NTParameterDetermined.hpp>

#include <samchon/library/XML.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::namtree;

auto NTParameterDetermined::TAG() const -> String { return _T("parameterDetermined"); }

NTParameterDetermined::NTParameterDetermined()
	: super()
{
}
void NTParameterDetermined::construct(shared_ptr<XML> xml)
{
	label = xml->getProperty(_T("label"));
	value = xml->hasProperty(_T("value"))
		? xml->getProperty<double>(_T("value")) : NUM_NULL;
}

auto NTParameterDetermined::key() const -> String
{
	return label;
}
auto NTParameterDetermined::getLabel() const -> String
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
	xml->setProperty(_T("label"), label);
	if(value != NUM_NULL)
		xml->setProperty(_T("value"), value);

	return xml;
}