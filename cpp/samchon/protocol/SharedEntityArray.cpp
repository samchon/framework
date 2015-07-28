#include <samchon/protocol/SharedEntityArray.hpp>

using namespace samchon;
using namespace samchon::protocol;

SharedEntityArray::SharedEntityArray()
	: super()
{
}

auto SharedEntityArray::operator[](size_t x) const -> Entity*
{
	return super::operator[](x).get();
}
auto SharedEntityArray::at(size_t x) const -> Entity*
{
	return super::at(x).get();
}
auto SharedEntityArray::get(const String &key) const -> Entity*
{
	return super::get(key).get();
}