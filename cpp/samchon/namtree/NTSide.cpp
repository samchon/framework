#include <samchon/namtree/NTSide.hpp>

#include <samchon/namtree/NTFactory.hpp>
#include <samchon/namtree/NTFile.hpp>
#include <samchon/namtree/NTIterator.hpp>

#include <samchon/Map.hpp>
#include <samchon/library/XML.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::namtree;

auto NTSide::TAG() const -> String { return _T("side"); }

NTSide::NTSide(NTFactory *factory)
	: super()
{
	this->factory = factory;
	file = nullptr;
	parameterMap = new Map<String, double>();
}
NTSide::~NTSide()
{
	delete parameterMap;
}

void NTSide::construct(shared_ptr<XML> xml)
{
	parameterMap->clear();
	if (xml->hasProperty(_T("parameterList")) == false)
		return;

	shared_ptr<XMLList> &parameterList = xml->get(_T("parameterList"));
	for (auto it = parameterList->begin(); it != parameterList->end(); it++)
	{
		shared_ptr<XML> &parameter = *it;
		String &name = parameter->getProperty(_T("name"));
		String &strValue = parameter->getValue();

		parameterMap->set
		(
			name, 
			strValue.empty() == false
				? stod(strValue) 
				: NUM_NULL
		);
	}
}

void NTSide::initRetrieve()
{

}
auto NTSide::calcRetrieved(NTIterator &iterator) const -> double
{
	return file->getFunction()(iterator, *parameterMap);
}

auto NTSide::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty(_T("fileUID"), file->key());

	shared_ptr<XML> parameterListXML(new XML());
	parameterListXML->setTag(_T("parameterList"));

	for (auto it = parameterMap->begin(); it != parameterMap->end(); it++)
	{
		shared_ptr<XML> parameter(new XML());
		parameter->setTag(_T("parameter"));

		parameter->setProperty(_T("name"), it->first);
		if (it->second != NUM_NULL)
			parameter->setValue( toString(it->second) );

		parameterListXML->push_back(parameter);
	}
	xml->push_back(parameterListXML);

	return xml;
}