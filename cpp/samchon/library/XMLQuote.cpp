#include <samchon/library/XMLQuote.hpp>
using namespace samchon::library;

XMLQuote::XMLQuote(size_t type, size_t startPoint, size_t endPoint)
{
	this->type = type;
	this->startPoint = startPoint;
	this->endPoint = endPoint;
}

auto XMLQuote::getType() const -> size_t
{
	return type;
}
auto XMLQuote::getStartPoint() const -> size_t
{
	return startPoint;
}
auto XMLQuote::getEndPoint() const -> size_t
{
	return endPoint;
}