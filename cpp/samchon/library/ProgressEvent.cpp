#include <samchon/library/ProgressEvent.hpp>
using namespace samchon::library;

ProgressEvent::ProgressEvent(EventDispatcher *source, double numerator, double denominator)
	: Event(source, type)
{
	this->numerator = numerator;
	this->denominator = denominator;
}

auto ProgressEvent::getNumerator() const -> double
{
	return numerator;
};
auto ProgressEvent::getDenominator() const -> double
{
	return denominator;
};
auto ProgressEvent::getPercent() const -> double
{
	return numerator / denominator;
};