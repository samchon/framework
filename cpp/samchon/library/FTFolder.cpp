#include <samchon/library/FTFolder.hpp>
#	include <samchon/library/FTFactory.hpp>
#	include <samchon/library/FTFile.hpp>

#include <samchon/library/XML.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

auto FTFolder::CHILD_TAG() const -> string { return FTInstance::TAG(); }

FTFolder::FTFolder(FTFactory *factory, FTFolder *parent)
	: super(), 
	FTInstance(parent)
{
	this->factory = factory;
}
void FTFolder::construct(shared_ptr<XML> xml)
{
	super::construct(xml);
	FTInstance::construct(xml);
}

auto FTFolder::createChild(shared_ptr<XML> xml) -> FTInstance*
{
	FTInstance *file = nullptr;
	if (xml->hasProperty("extension") == false)
		file = new FTFolder(factory, this);
	else
		file = factory->createFile(this, xml);
		
	factory->registerInstance(file);
	return file;
}

auto FTFolder::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->addAllProperties(FTInstance::toXML());

	return xml;
}