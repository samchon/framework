#include <samchon/library/ProgressEvent.hpp>
using namespace samchon::library;

ProgressEvent::ProgressEvent(EventDispatcher *source, long type, long long numerator, long long denominator)
	: Event(source, type)
{
	this->numerator = numerator;
	this->denominator = denominator;
}
ProgressEvent::ProgressEvent(EventDispatcher *source, long long numerator, long long denominator)
	: ProgressEvent(source, PROGRESS, numerator, denominator) {}

auto ProgressEvent::getNumerator() const -> long long
{
	return numerator;
};
auto ProgressEvent::getDenominator() const -> long long
{
	return denominator;
};
auto ProgressEvent::getPercent() const -> double
{
	return numerator / (double)denominator;
};