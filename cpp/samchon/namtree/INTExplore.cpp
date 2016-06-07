#include <samchon/namtree/INTExplore.hpp>

#include <samchon/library/XML.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::namtree;

INTExplore::INTExplore()
	: super()
{
	minimum = INT_MIN;
	maximum = INT_MIN;
	section = 0;
	precision = INT_MIN;
}
void INTExplore::construct(shared_ptr<XML> xml)
{
	minimum = xml->has_property("minimum")
		? xml->get_property<double>("minimum")
		: INT_MIN;
	maximum = xml->has_property("maximum")
		? xml->get_property<double>("maximum")
		: INT_MIN;

	section = xml->has_property("section")
		? xml->get_property<unsigned int>("section")
		: 0;
	precision = xml->has_property("precision")
		? xml->get_property<int>("precision")
		: INT_MIN;
}

auto INTExplore::getMinimum() const -> double
{
	return minimum;
}
auto INTExplore::getMaximum() const -> double
{
	return maximum;
}
auto INTExplore::getSection() const -> unsigned int
{
	return section;
}
auto INTExplore::getPrecision() const -> int
{
	return precision;
}

auto INTExplore::to_XML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::to_XML();
	if (minimum != INT_MIN)		xml->set_property("minimum",	minimum);
	if (maximum != INT_MIN)		xml->set_property("maximum",	maximum);
	if (section != 0)			xml->set_property("section", section);
	if (precision != INT_MIN)	xml->set_property("precision", precision);

	return xml;
}