#include "Instance.hpp"

#include <samchon/library/StringUtil.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::example::packer;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
Instance::Instance(const string &name, int price, int volume, int weight)
{
	this->name = name;
	this->price = price;
	this->volume = volume;
	this->weight = weight;
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
auto Instance::toString() const -> string
{
	return StringUtil::substitute
		(
			"{1}: ${2}, {3}cm^3, {4}g",
			name, price, volume, weight
		);
}