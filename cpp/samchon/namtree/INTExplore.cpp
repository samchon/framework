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
	minimum = NUM_NULL;
	maximum = NUM_NULL;
	bin = NUM_NULL;
}
void INTExplore::construct(shared_ptr<XML> xml)
{
	minimum = xml->hasProperty(_T("minimum"))
		? xml->getProperty<double>(_T("minimum"))
		: NUM_NULL;
	maximum = xml->hasProperty(_T("maximum"))
		? xml->getProperty<double>(_T("maximum"))
		: NUM_NULL;
	bin = xml->hasProperty(_T("bin"))
		? xml->getProperty<double>(_T("bin"))
		: NUM_NULL;
}

auto INTExplore::getMinimum() const -> double
{
	return minimum;
}
auto INTExplore::getMaximum() const -> double
{
	return maximum;
}
auto INTExplore::getBin() const -> double
{
	return bin;
}

auto INTExplore::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	if (minimum != NUM_NULL)	xml->setProperty(_T("minimum"),	minimum);
	if (maximum != NUM_NULL)	xml->setProperty(_T("maximum"),	maximum);
	if (bin != NUM_NULL)		xml->setProperty(_T("bin"),		bin);

	return xml;
}