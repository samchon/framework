#include <samchon/example/packer/ProductArray.hpp>

using namespace std;
using namespace samchon::library;
using namespace samchon::example::packer;

auto ProductArray::createChild(shared_ptr<XML>) -> Product*
{
	return new Product();
}

auto ProductArray::TAG() const -> string
{
	return "productArray";
}
auto ProductArray::CHILD_TAG() const -> string
{
	return "product";
}