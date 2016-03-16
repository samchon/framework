#include <samchon/library/FTInstance.hpp>

#include <samchon/library/XML.hpp>

using namespace std;

using namespace samchon;
using namespace samchon::library;
using namespace samchon::protocol;

auto FTInstance::TAG() const -> string { return "file"; }

FTInstance::FTInstance(FTFolder *parent)
	: super()
{
	this->parent = parent;
}
void FTInstance::construct(shared_ptr<XML> xml)
{
	uid = xml->getProperty<int>("uid");
	name = xml->getProperty("name");
	comment = xml->getProperty("comment");
}

auto FTInstance::key() const -> string
{
	return to_string(uid);
}
auto FTInstance::getUID() const -> int
{
	return uid;
}
auto FTInstance::getParent() const -> FTFolder*
{
	return parent;
}
auto FTInstance::getName() const -> string
{
	return name;
}
auto FTInstance::getComment() const -> string
{
	return comment;
}

auto FTInstance::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("uid", uid);
	xml->setProperty("name", name);
	xml->setProperty("comment", comment);

	return xml;
}