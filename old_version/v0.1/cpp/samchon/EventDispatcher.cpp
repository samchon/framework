#include <samchon/EventDispatcher.hpp>

#include <iostream>

#include <atomic>
#include <condition_variable>
#include <memory>
#include <mutex>
#include <thread>
#include <vector>

#include <samchon/CriticalMap.hpp>
#include <samchon/CriticalSet.hpp>
#include <samchon/Event.hpp>
#include <samchon/ErrorEvent.hpp>
#include <samchon/ProgressEvent.hpp>

namespace samchon
{
	/* -------------------------------------------------------------
		CONSTRUCTORS
	------------------------------------------------------------- */
	EventDispatcher::EventDispatcher()
	{
		eventSetMap = new CriticalMap<long, shared_ptr<CriticalSet<void(*)(shared_ptr<Event>)>>>();
		progressSet = new CriticalSet<void(*)(shared_ptr<ProgressEvent>)>();
		errorSet = new CriticalSet<void(*)(shared_ptr<ErrorEvent>)>();
	}
	EventDispatcher::~EventDispatcher()
	{
		delete eventSetMap;
		delete progressSet;
		delete errorSet;
	}

	void EventDispatcher::setAddiction(void *ptr)
	{
		addiction = ptr;
	}
	auto EventDispatcher::getAddiction() const -> void*
	{
		return addiction;
	}

	/* -------------------------------------------------------------
		EVENT LISTENER IN & OUT
	------------------------------------------------------------- */
	void EventDispatcher::addEventListener(long type, void(*listener)(shared_ptr<Event>))
	{
		if (eventSetMap->has(type) == false)
			eventSetMap->insert({ type, shared_ptr<CriticalSet<void(*)(shared_ptr<Event>)>>(new CriticalSet<void(*)(shared_ptr<Event>)>()) });

		auto &set = eventSetMap->get(type);
		if (set->has(listener) == false)
			set->insert(listener);
	}
	void EventDispatcher::addEventListener(long type, void(*listener)(shared_ptr<ErrorEvent>))
	{
		if (errorSet->has(listener) == false)
			errorSet->insert(listener);
	}
	void EventDispatcher::addEventListener(long type, void(*listener)(shared_ptr<ProgressEvent>))
	{
		if (progressSet->has(listener) == false)
			progressSet->insert(listener);
	}

	void EventDispatcher::removeEventListener(long type, void(*listener)(shared_ptr<Event>))
	{
		if (eventSetMap->has(type) == true && eventSetMap->get(type)->has(listener) == true)
			eventSetMap->get(type)->erase(listener);
	}
	void EventDispatcher::removeEventListener(long type, void(*listener)(shared_ptr<ErrorEvent>))
	{
		if (errorSet->has(listener) == true)
			errorSet->erase(listener);
	}
	void EventDispatcher::removeEventListener(long type, void(*listener)(shared_ptr<ProgressEvent>))
	{
		if (progressSet->has(listener) == true)
			progressSet->erase(listener);
	}

	/* -------------------------------------------------------------
		SEND EVENT
	------------------------------------------------------------- */
	void EventDispatcher::eventActivated()
	{
		sendEvent(Event::ACTIVATE);
	}
	void EventDispatcher::eventCompleted()
	{
		sendEvent(Event::COMPLETE);
	}
	void EventDispatcher::sendRemoved()
	{
		if (eventSetMap->has(Event::REMOVED) == false)
			return;

		shared_ptr<Event> event(new Event(this, Event::REMOVED));
		auto &eventSet = eventSetMap->get(event->getType());

		eventSet->readLock();
		for (auto it = eventSet->begin(); it != eventSet->end(); it++)
			(*it)(event);
		eventSet->readUnlock();
	}

	void EventDispatcher::sendEvent(long type)
	{
		if (type == Event::REMOVED)
		{
			sendRemoved();
			return;
		}
		else if (eventSetMap->has(type) == false)
			return;

		shared_ptr<Event> event(new Event(this, type));
		auto &eventSet = eventSetMap->get(event->getType());

		eventSet->readLock();
		for (auto it = eventSet->begin(); it != eventSet->end(); it++)
			thread(*it, event).detach();
		eventSet->readUnlock();
	}
	void EventDispatcher::sendError(long id)
	{
		shared_ptr<ErrorEvent> event(new ErrorEvent(this, ErrorEvent::ERROR_OCCURED, id));

		errorSet->readLock();
		for (auto it = errorSet->begin(); it != errorSet->end(); it++)
			thread(*it, event).detach();
		errorSet->readUnlock();
	}
	void EventDispatcher::sendProgress(unsigned long long x, unsigned long long size)
	{
		shared_ptr<ProgressEvent> event(new ProgressEvent(this, x, size));

		progressSet->readLock();
		for (auto it = progressSet->begin(); it != progressSet->end(); it++)
			thread(*it, event).detach();
		progressSet->readUnlock();
	}
};