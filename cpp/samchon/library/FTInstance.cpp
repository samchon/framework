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
	uid = xml->get_property<int>("uid");
	name = xml->get_property("name");
	comment = xml->get_property("comment");
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
auto FTInstance::get_name() const -> string
{
	return name;
}
auto FTInstance::getComment() const -> string
{
	return comment;
}

auto FTInstance::to_XML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::to_XML();
	xml->set_property("uid", uid);
	xml->set_property("name", name);
	xml->set_property("comment", comment);

	return xml;
}