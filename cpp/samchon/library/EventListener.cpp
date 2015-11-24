#include <samchon/library/EventListener.hpp>

samchon::library::EventListener::EventListener(bool Active)
{
	this->sActivated = Active;
}

auto samchon::library::EventListener::isActivated() -> bool
{
	return this->sActivated;
}
