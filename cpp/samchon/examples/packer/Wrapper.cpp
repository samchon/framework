#include "Wrapper.hpp"
#	include "Product.hpp"

using namespace std;
using namespace samchon::examples::packer;

/* ---------------------------------------------------------
	CONSTRUCTORS
--------------------------------------------------------- */
Wrapper::Wrapper(const string &name, int price, int volume, int weight)
	: super(name, price, volume, weight),
	vector<Product*>()
{
}
Wrapper::Wrapper(const Wrapper &wrapper)
	: super(wrapper),
	vector<Product*>()
{
}

auto Wrapper::tryInsert(Product *product) -> bool
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
auto Wrapper::toString() const -> string
{
	string str = "\tWrapper " + super::toString() + "\n";
	for (size_t i = 0; i < size(); i++)
		str += "\t\t" + at(i)->toString() + ((i == size() - 1) ? "" : "\n");

	return move(str);
};