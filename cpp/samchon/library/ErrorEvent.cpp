#include <samchon/library/ErrorEvent.hpp>
using namespace samchon::library;

ErrorEvent::ErrorEvent(EventDispatcher *source, long type, long id)
	: Event(source, type)
{
	this->id = id;
}
auto ErrorEvent::getID() const -> long
{
	return id;
}