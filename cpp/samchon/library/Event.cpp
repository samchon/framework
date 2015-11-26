#include <samchon/library/Event.hpp>
#include <samchon/library/StaticEventDispatcher.hpp>
using namespace samchon::library;

Event::Event(StaticEventDispatcher *source, int type)
{
	this->source = source;
	this->type = type;
}

auto Event::getSource() const -> StaticEventDispatcher*
{
	return source;
}
auto Event::getType() const -> int
{
	return type;
}