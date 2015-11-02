#include <samchon/examples/packer/Product.hpp>

using namespace std;
using namespace samchon::example::packer;

Product::Product()
	: super()
{
}
Product::Product(const string &name, int price, int volume, int weight)
	: super(name, price, volume, weight)
{
}

auto Product::TAG() const -> string
{
	return "product";
}
auto Product::toString() const -> string
{
	return "Product " + super::toString();
}