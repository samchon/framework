#include <samchon/ErrorEvent.hpp>

namespace samchon
{
	ErrorEvent::ErrorEvent(EventDispatcher *source, long type, long id)
		: BaseEvent(source, type) 
	{
		this->id = id;
	}
	auto ErrorEvent::getID() const -> long
	{
		return id;
	}
};