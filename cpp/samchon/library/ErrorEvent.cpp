#include <samchon/library/ErrorEvent.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

ErrorEvent::ErrorEvent(StaticEventDispatcher *source, const string &message)
	: Event(source, ErrorEvent::ERROR)
{
	this->message = message;
}
auto ErrorEvent::getMessage() const -> std::string
{
	return message;
}