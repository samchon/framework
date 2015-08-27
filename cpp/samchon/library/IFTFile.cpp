#include <samchon/namtree/IFTFile.hpp>

#include <samchon/library/XML.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;
using namespace samchon::namtree;

auto IFTFile::TAG() const -> String { return _T("file"); }

IFTFile::IFTFile(FTFolder *parent)
	: super()
{
	this->parent = parent;
}
void IFTFile::construct(shared_ptr<XML> xml)
{
	uid = xml->getProperty<int>(_T("uid"));
	name = xml->getProperty(_T("name"));
	comment = xml->getProperty(_T("comment"));
}

auto IFTFile::key() const -> String
{
	return toString(uid);
}
auto IFTFile::getUID() const -> int
{
	return uid;
}
auto IFTFile::getParent() const -> FTFolder*
{
	return parent;
}
auto IFTFile::getName() const -> String
{
	return name;
}
auto IFTFile::getComment() const -> String
{
	return comment;
}

auto IFTFile::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty(_T("uid"), uid);
	xml->setProperty(_T("name"), name);
	xml->setProperty(_T("comment"), comment);

	return xml;
}