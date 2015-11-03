#include <samchon/example/packer/Wrapper.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::example::packer;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
Wrapper::Wrapper()
	: super(),
	Instance()
{
}
Wrapper::Wrapper(const string &name, int price, int volume, int weight)
	: super(),
	Instance(name, price, volume, weight)
{
}
Wrapper::Wrapper(const Wrapper &wrapper)
	: super(), //DO NOT COPY CHILDREN
	Instance(wrapper) //BUT INSTANCE'S ARGUMENTS
{
}

void Wrapper::construct(shared_ptr<XML> xml)
{
	super::construct(xml);
	Instance::construct(xml);
}

auto Wrapper::tryInsert(shared_ptr<Product> product) -> bool
{
	int volume = 0;
	int weight = 0;

	for (size_t i = 0; i < size(); i++)
	{
		volume += at(i)->getVolume();
		weight += at(i)->getWeight();
	}

	if (product->getVolume() + volume > this->volume || 
		product->getWeight() + weight > this->weight)
	{
		return false;
	}

	push_back(product);
	return true;
}

/* ---------------------------------------------------------
	EXPORT
--------------------------------------------------------- */
auto Wrapper::TAG() const -> string
{
	return "wrapper";
}
auto Wrapper::toXML() const -> shared_ptr<XML>
{
	shared_ptr<XML> &xml = super::toXML();
	xml->addAllProperty(Instance::toXML());

	return xml;
}

auto Wrapper::toString() const -> string
{
	string str = "\tWrapper " + Instance::toString() + "\n";
	for (size_t i = 0; i < size(); i++)
		str += "\t\t" + at(i)->toString() + ((i == size() - 1) ? "" : "\n");

	return move(str);
};