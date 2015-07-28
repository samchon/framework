#include <samchon/library/BaseEvent.hpp>
using namespace std;
using namespace samchon::library;

BaseEvent::BaseEvent(EventDispatcher *source, long type)
{
	this->source = source;
	this->type = type;
}
BaseEvent::~BaseEvent() {}

auto BaseEvent::getSource() const -> EventDispatcher*
{
	return source;
}
auto BaseEvent::getType() const -> long
{
	return type;
}