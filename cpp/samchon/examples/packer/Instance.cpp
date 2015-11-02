#include <samchon/examples/packer/Instance.hpp>

#include <samchon/library/StringUtil.hpp>
#include <samchon/library/XML.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::example::packer;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
Instance::Instance()
	: super()
{
}
Instance::Instance(const string &name, int price, int volume, int weight)
	: super()
{
	this->name = name;
	this->price = price;
	this->volume = volume;
	this->weight = weight;
}

void Instance::construct(shared_ptr<XML> xml)
{
	this->name = xml->getProperty("name");
	this->price = xml->getProperty<int>("price");
	this->volume = xml->getProperty<int>("volume");
	this->weight = xml->getProperty<int>("weight");
}

/* ---------------------------------------------------------
	GETTERS
--------------------------------------------------------- */
auto Instance::getName() const -> string
{
	return name;
}
auto Instance::getPrice() const -> int
{
	return price;
}
auto Instance::getVolume() const -> int
{
	return volume;
}
auto Instance::getWeight() const -> int
{
	return weight;
}

/* ---------------------------------------------------------
	EXPORT
--------------------------------------------------------- */
auto Instance::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->setProperty("name", name);
	xml->setProperty("price", price);
	xml->setProperty("volume", volume);
	xml->setProperty("weight", weight);

	return xml;
}
auto Instance::toString() const -> string
{
	return StringUtil::substitute
		(
			"{1}: ${2}, {3}cm^3, {4}g",
			name, price, volume, weight
		);
}