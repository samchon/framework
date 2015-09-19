#include <samchon/library/ProgressEvent.hpp>
using namespace samchon::library;

ProgressEvent::ProgressEvent(EventDispatcher *source, size_t numerator, size_t denominator)
	: Event(source, type)
{
	this->numerator = numerator;
	this->denominator = denominator;
}

auto ProgressEvent::getNumerator() const -> size_t
{
	return numerator;
};
auto ProgressEvent::getDenominator() const -> size_t
{
	return denominator;
};
auto ProgressEvent::getPercent() const -> double
{
	return numerator / (double)denominator;
};