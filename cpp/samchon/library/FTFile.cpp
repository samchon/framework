#include <samchon/library/FTFile.hpp>
#include <samchon/library/FTFactory.hpp>

#include <samchon/library/XML.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

FTFile::FTFile(FTFolder *parent)
	: super(parent)
{
}
void FTFile::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	extension = xml->getProperty("extension");
}

auto FTFile::getExtension() const -> string
{
	return extension;
}

auto FTFile::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("extension", extension);

	return xml;
}