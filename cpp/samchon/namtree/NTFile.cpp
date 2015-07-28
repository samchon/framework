#include <samchon/namtree/NTFile.hpp>
#	include <samchon/namtree/NTFactory.hpp>
#	include <samchon/namtree/NTParameterArray.hpp>

#include <samchon/library/XML.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::namtree;

NTFile::NTFile(NTFactory *factory, FTFolder *parent)
	: super(parent),
	INTExplore()
{
	this->factory = factory;
	function = nullptr;
	otherside = nullptr;
}
void NTFile::construct(shared_ptr<XML> xml)
{
	super::construct(xml);
	if (xml->has(parameterArray->TAG()) == true)
		parameterArray->construct( xml->get(parameterArray->TAG())->at(0) );
}

auto NTFile::getParameterArray() const -> const NTParameterArray*
{
	return parameterArray;
}
auto NTFile::getOtherside() const -> NTFile*
{
	return otherside;
}
auto NTFile::getFunction() const -> double(*)(NTIterator&, Map<String, double>&)
{
	return function;
}

auto NTFile::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->push_back(parameterArray->toXML());
	
	if (otherside != nullptr)
		xml->setProperty(_T("othersideUID"), otherside->key());
	
	return xml;
}