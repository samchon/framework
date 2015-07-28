#include <samchon/library/IOperator.hpp>
using namespace samchon::library;

IOperator::IOperator() {}

auto IOperator::operator!=(const IOperator &obj) const -> bool
{
	return !operator==(obj);
}
auto IOperator::operator<=(const IOperator &obj) const -> bool
{
	return operator<(obj) || operator==(obj);
}
auto IOperator::operator>(const IOperator &obj) const -> bool
{
	return !operator<(obj) && !operator==(obj);
}
auto IOperator::operator>=(const IOperator &obj) const -> bool
{
	return !operator<(obj);
}