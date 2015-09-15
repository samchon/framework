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
	minimum = xml->hasProperty("minimum")
		? xml->getProperty<double>("minimum")
		: INT_MIN;
	maximum = xml->hasProperty("maximum")
		? xml->getProperty<double>("maximum")
		: INT_MIN;

	section = xml->hasProperty("section")
		? xml->getProperty<unsigned int>("section")
		: 0;
	precision = xml->hasProperty("precision")
		? xml->getProperty<int>("precision")
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

auto INTExplore::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	if (minimum != INT_MIN)		xml->setProperty("minimum",	minimum);
	if (maximum != INT_MIN)		xml->setProperty("maximum",	maximum);
	if (section != 0)			xml->setProperty("section", section);
	if (precision != INT_MIN)	xml->setProperty("precision", precision);

	return xml;
}