#include <samchon/BaseEvent.hpp>

namespace samchon
{
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
}