#include <API.hpp>

using namespace std;
using namespace samchon;
using namespace samchon::library;

/* ----------------------------------------------------------
	CONSTRUCTORS
---------------------------------------------------------- */
EventDispatcher::EventDispatcher()
{
}
EventDispatcher::EventDispatcher(const EventDispatcher &obj)
{
	// DO NOT COPY LISTENERS
}
EventDispatcher::EventDispatcher(EventDispatcher &&obj)
{
	UniqueWriteLock obj_uk(obj.mtx);
	{
		listeners = move(obj.listeners);
	}
	obj_uk.unlock();
	
	unique_lock<mutex> s_uk(sMtx);

	for (auto it = eventMap.begin(); it != eventMap.end(); it++)
		if (it->first == &obj)
		{
			auto event = it->second;

			it = eventMap.erase(it);
			eventMap.insert(it, { this, event });
		}
}

EventDispatcher::~EventDispatcher()
{
	UniqueWriteLock my_uk(mtx);
	unique_lock<mutex> s_uk(sMtx);

	for (auto it = eventMap.begin(); it != eventMap.end();)
		if (it->first == this)
			eventMap.erase(it++);
		else
			it++;
}

/* ----------------------------------------------------------
	ADD-REMOVE EVENT LISTENERS
---------------------------------------------------------- */
void EventDispatcher::addEventListener(int type, Listener listener, void *addiction)
{
	UniqueWriteLock uk(mtx);

	listeners[type][listener].insert(addiction);
}
void EventDispatcher::removeEventListener(int type, Listener listener, void *addiction)
{
	UniqueWriteLock uk(mtx);
	if (listeners.count(type) == 0)
		return;

	// TEST WHETHER HAS THE LISTENER
	if (listeners.count(type) == 0 || 
		listeners[type].count(listener) == 0 || 
		listeners[type][listener].count(addiction) == 0)
		return;

	listeners[type][listener].erase(addiction);

	if (listeners[type][listener].empty() == true)
		listeners[type].erase(listener);
	
	if (listeners[type].empty() == true)
		listeners.erase(type);

	// NEED TO DELETE FROM EVENT MAP
}

void EventDispatcher::dispatch(std::shared_ptr<Event> event)
{
	// STARTS BACK-GROUND PROCESS IF NOT STARTED
	start();

	UniqueReadLock my_uk(mtx);
	if (listeners.count(event->getType()) == 0)
		return;

	my_uk.unlock();

	unique_lock<mutex> s_uk(sMtx);
	eventMap.insert({this, event});
	
	cv.notify_all();
}
void EventDispatcher::deliver(shared_ptr<Event> event)
{
	UniqueReadLock my_uk(mtx);
	if (listeners.count(event->getType()) == 0)
		return;

	auto listenerMap = listeners[event->getType()];
	my_uk.unlock();

	for (auto it = listenerMap.begin(); it != listenerMap.end(); it++)
	{
		Listener listener = it->first;
		
		for (auto s_it = it->second.begin(); s_it != it->second.end(); s_it++)
		{
			void *addiction = *s_it;

			listener(event, addiction);
		}
	}
}

/* ----------------------------------------------------------
	MEMBERS OF STATIC
---------------------------------------------------------- */
size_t EventDispatcher::THREAD_SIZE = 2;

bool EventDispatcher::started = false;
condition_variable EventDispatcher::cv;
mutex EventDispatcher::cv_mtx;

unordered_multimap<EventDispatcher*, shared_ptr<Event>> EventDispatcher::eventMap;
mutex EventDispatcher::sMtx;

void EventDispatcher::start()
{
	unique_lock<mutex> uk(sMtx);
	if (started == true)
		return;

	started = true;
	uk.unlock();

	for (size_t i = 0; i < THREAD_SIZE; i++)
	{
		thread([]()
		{
			while (true)
			{
				while (true)
				{
					unique_lock<mutex> uk(sMtx);
					if (eventMap.empty() == true)
						break;

					auto pair = *eventMap.begin();
					eventMap.erase(eventMap.begin());
					
					uk.unlock();

					EventDispatcher *obj = pair.first;
					shared_ptr<Event> &event = pair.second;

					obj->deliver(event);
				}
				
				unique_lock<mutex> cv_uk(cv_mtx);
				cv.wait(cv_uk);
			}
		}).detach();
	}
}