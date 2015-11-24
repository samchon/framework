#include <samchon/library/EventDispatcher.hpp>
#include <samchon\/library/EventListener.hpp>

#include <condition_variable>
#include <memory>
#include <mutex>
#include <thread>

#include <samchon/library/CriticalMap.hpp>
#include <samchon/library/CriticalSet.hpp>
#include <samchon/library/Event.hpp>
#include <samchon/library/ErrorEvent.hpp>
#include <samchon/library/ProgressEvent.hpp>

using namespace std;
using namespace samchon::library;

/* -------------------------------------------------------------
	CONSTRUCTORS
------------------------------------------------------------- */
EventDispatcher::EventDispatcher() 
{
}
EventDispatcher::EventDispatcher(const EventDispatcher &eventDispatcher)
{
	//DO NOT COPY EVENTS
}
EventDispatcher::EventDispatcher(EventDispatcher &&eventDispatcher)
{
	//COPY EVENTS
}

/* -------------------------------------------------------------
	EVENT LISTENER IN & OUT
------------------------------------------------------------- */
void EventDispatcher::addEventListener(int type, EventListener *listener)
{
	UniqueWriteLock uk(mtx);

	this->listeners.push_back(listener);

	return;

}

void EventDispatcher::removeEventListener(int type, EventListener *listener)
{
	UniqueWriteLock uk(mtx);

	for (auto it = this->listeners.begin(); it != this->listeners.end(); it++)
	{
		if (listener != (*it))  continue;
		listeners.erase(it);
	}

	return;
}

/* -------------------------------------------------------------
	SEND EVENT
------------------------------------------------------------- */
auto EventDispatcher::dispatchEvent(Event *event) -> bool
{
	UniqueReadLock uk(mtx);
	UniqueReadLock itk(RWMutex(), false);

	thread *pThreads[bThreads];
	queue<EventListener*> queue_listener;

	for (auto it = this->listeners.begin(); it != this->listeners.end(); it++)
	{
		if (!(*it)->isActivated()) continue;

		queue_listener.push((*it));
	}

	uk.unlock();

	for (unsigned char it = 0; it != bThreads; it++)
	{
		pThreads[it] = new thread([](
			Event *event, 
			UniqueReadLock *it_mutex,
			queue<EventListener*> *queue)
		{
			EventListener *Listener = nullptr;

			while (!queue->empty())
			{
				it_mutex->lock();
				Listener = queue->front();
				queue->pop();
				it_mutex->unlock();

				Listener->Dispatch(event);
			}

		}, event, &itk, &queue_listener);
	}


	return true;
}

#ifdef LEGACY
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
	if (eventSetMap.has(Event::REMOVED) == false)
		return;

	shared_ptr<Event> event(new Event(this, Event::REMOVED));
	auto eventSet = eventSetMap.get(event->getType());

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
	else if (eventSetMap.has(type) == false)
		return;

	shared_ptr<Event> event(new Event(this, type));
	auto eventSet = eventSetMap.get(event->getType());

	eventSet->readLock();
	for (auto it = eventSet->begin(); it != eventSet->end(); it++)
		thread(*it, event).detach();
	eventSet->readUnlock();
}
void EventDispatcher::sendError(long id)
{
	shared_ptr<ErrorEvent> event(new ErrorEvent(this, ErrorEvent::ERROR_OCCURED, id));

	errorSet.readLock();
	for (auto it = errorSet.begin(); it != errorSet.end(); it++)
		thread(*it, event).detach();
	errorSet.readUnlock();
}
void EventDispatcher::sendProgress(unsigned long long x, unsigned long long size)
{
	shared_ptr<ProgressEvent> event(new ProgressEvent(this, x, size));

	progressSet.readLock();
	for (auto it = progressSet.begin(); it != progressSet.end(); it++)
		thread(*it, event).detach();
	progressSet.readUnlock();
}
#endif