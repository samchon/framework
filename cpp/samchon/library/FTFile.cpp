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

	extension = xml->get_property("extension");
}

auto FTFile::getExtension() const -> string
{
	return extension;
}

auto FTFile::to_XML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::to_XML();
	xml->set_property("extension", extension);

	return xml;
}