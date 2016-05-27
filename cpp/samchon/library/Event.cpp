#include <samchon/library/Event.hpp>
#include <samchon/library/EventDispatcher.hpp>
using namespace samchon::library;

Event::Event(EventDispatcher *source, int type)
{
	this->source = source;
	this->type = type;
}

auto Event::getSource() const -> EventDispatcher*
{
	return source;
}
auto Event::get_type() const -> int
{
	return type;
}