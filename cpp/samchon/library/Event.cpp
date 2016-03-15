#include <API.hpp>

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
auto Event::getType() const -> int
{
	return type;
}