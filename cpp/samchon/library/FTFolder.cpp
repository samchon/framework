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

auto FTFolder::create_child(shared_ptr<XML> xml) -> FTInstance*
{
	FTInstance *file = nullptr;
	if (xml->has_property("extension") == false)
		file = new FTFolder(factory, this);
	else
		file = factory->createFile(this, xml);
		
	factory->registerInstance(file);
	return file;
}

auto FTFolder::to_XML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::to_XML();
	xml->add_all_properties(FTInstance::to_XML());

	return xml;
}