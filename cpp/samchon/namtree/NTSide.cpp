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

auto NTSide::TAG() const -> string { return "side"; }

NTSide::NTSide(NTFactory *factory)
	: super()
{
	this->factory = factory;
	file = nullptr;
}
void NTSide::construct(shared_ptr<XML> xml)
{
	
	if (xml->hasProperty("parameterArray") == false)
		return;

	shared_ptr<XMLList> &parameterList = xml->get("parameterArray");
	for (auto it = parameterList->begin(); it != parameterList->end(); it++)
	{
		shared_ptr<XML> &parameter = *it;
		string &name = parameter->getProperty("name");
		string &strValue = parameter->getValue();

		parameters.push_back
		(
			strValue.empty() == false
				? stod(strValue) 
				: INT_MIN
		);
	}
}

void NTSide::initRetrieve()
{

}
auto NTSide::calcRetrieved(NTIterator &iterator) const -> double
{
	return file->getFunction()(iterator, parameters);
}

auto NTSide::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("fileUID", file->key());

	shared_ptr<XML> parameterListXML(new XML());
	parameterListXML->setTag("parameterArray");

	for (auto it = parameters.begin(); it != parameters.end(); it++)
	{
		shared_ptr<XML> parameter(new XML());
		parameter->setTag("parameter");
		
		if (*it != INT_MIN)
			continue;
		
		parameter->setValue( to_string(*it) );
		parameterListXML->push_back(parameter);
	}
	xml->push_back(parameterListXML);

	return xml;
}