#include <samchon/library/Event.hpp>
#include <samchon/library/EventDispatcher.hpp>
using namespace samchon::library;

Event::Event(EventDispatcher *source, long type)
{
	this->source = source;
	this->type = type;
}

auto Event::getSource() const -> EventDispatcher*
{
	return source;
}
auto Event::getType() const -> long
{
	return type;
}