#include <samchon/library/FTFolder.hpp>
#	include <samchon/library/FTFactory.hpp>
#	include <samchon/library/FTFile.hpp>

#include <samchon/library/XML.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

auto FTFolder::TAG() const -> string { return super::TAG(); }
auto FTFolder::CHILD_TAG() const -> string { return super::TAG(); }

FTFolder::FTFolder(FTFactory *factory, FTFolder *parent)
	: super(parent), SharedEntityArray()
{
	this->factory = factory;
}
void FTFolder::construct(shared_ptr<XML> xml)
{
	super::construct(xml);
	SharedEntityArray::construct(xml);
}

auto FTFolder::createChild(shared_ptr<XML> xml) -> Entity*
{
	FTInstance *file = nullptr;
	if (xml->hasProperty("extension") == false)
		file = new FTFolder(factory, this);
	else
		file = factory->createFile(this, xml);
		
	factory->registerInstance(file);
	return file;
}

SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(FTFolder, FTInstance)

auto FTFolder::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = SharedEntityArray::toXML();
	xml->addAllProperty(super::toXML());

	return xml;
}