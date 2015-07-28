#include <samchon/namtree/FTFile.hpp>
#	include <samchon/namtree/FTFactory.hpp>

#include <samchon/library/XML.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::namtree;

FTFile::FTFile(FTFolder *parent)
	: super(parent)
{
}
void FTFile::construct(shared_ptr<XML> xml)
{
	super::construct(xml);

	extension = xml->getProperty(_T("extension"));
}

auto FTFile::getExtension() const -> String
{
	return extension;
}

auto FTFile::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty(_T("extension"), extension);

	return xml;
}