#include <samchon/Event.hpp>

namespace samchon
{
	Event::Event(EventDispatcher *source, long type)
		: BaseEvent(source, type) {}
};