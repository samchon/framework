#include <samchon/namtree/FTFolder.hpp>
#	include <samchon/namtree/FTFactory.hpp>
#	include <samchon/namtree/FTFile.hpp>

#include <samchon/library/XML.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::namtree;

auto FTFolder::TAG() const -> String { return super::TAG(); }
auto FTFolder::CHILD_TAG() const -> String { return super::TAG(); }

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
	IFTFile *file = nullptr;
	if (xml->hasProperty(_T("extension")) == false)
		file = new FTFolder(factory, this);
	else
		file = factory->createFile(this, xml);
		
	factory->registerFile(file);
	return file;
}

SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(FTFolder, IFTFile)

auto FTFolder::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = SharedEntityArray::toXML();
	xml->addAllProperty(super::toXML());

	return xml;
}