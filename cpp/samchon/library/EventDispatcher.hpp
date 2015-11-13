#pragma once
#include <samchon/API.hpp>

#include <memory>
#include <map>
#include <samchon/Set.hpp>

#include <samchon/library/RWMutex.hpp>
#include <samchon/library/Semaphore.hpp>

namespace samchon
{
	namespace library
	{
		class Event;
		class ErrorEvent;
		class ProgressEvent;

		/**
		 * @brief Abstract class for dispatching Event
		 *
		 * @details
		 * <p> EventDispatcher is the base class for all classes that dispatch events. </p>
		 *
		 * <p> All the events are sent asynchronously. To avoid from creating tooo enourmouse threads
		 * dispatching events, all event sending processes will acuiqre a semaphore. The default permitted
		 * size of the semaphore is 2. </p>
		 * 
		 *	\li Number of thread pools used to sending events is 2.
		 *
		 * <p> @image html  cpp/library_event.png
		 *	   @image latex cpp/library_event.png </p>
		 *
		 * \par Example Source
		 *		@includelineno example/event/main.cpp
		 *
		 * @deprecated 
		 * <p> EventDispatcher is a candidate to be deprecated. </p>
		 * <p> Since C++11, calling member method of a class by a new thread passing by static 
		 * method and using void pointer are recommeded to avoid. As the reason, using <i>std::thread</i> 
		 * and <i>std::bind</i> will be better. </p>
		 *
		 *	\li std::thread: http://www.cplusplus.com/reference/thread/thread/
		 *	\li std::bind: http://www.cplusplus.com/reference/functional/bind/
		 *
		 * @todo
		 * <p> Adjust new optimal size of semaphore representing size of backgrounds' thread.
		 * <p> Find another way to adding listeners of member method without using void pointer. 
		 * About the problem, pull request from a forked repository is planned to come. </p>
		 * 
		 * @test
		 * <p> Change listeners (function pointer) to have a new parameter, void pointer. </p>
		 * 
		 * @bug
		 * <p> When EventDispatcher is deleted, error on sending events are occured. </p>
		 *
		 * @see samchon::library
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API EventDispatcher
		{
		private:
			//EVENT-LISTENER CONTAINERS
			/**
			 * @brief A container storing listeners
			 */
			std::map<int, std::set<void(*)(std::shared_ptr<Event>)>> eventSetMap; //EVENT

			/**
			 * @brief A rw_mutex for concurrency
			 */
			RWMutex mtx;

			/**
			 * @brief A semaphore for restricting thread size
			 */
			Semaphore semaphore;

		public:
			/* ----------------------------------------------------------
				CONSTRUCTORS
			---------------------------------------------------------- */
			/**
			 * @brief Default Constructor
			 */
			EventDispatcher();

			/**
			 * @brief Copy Constructor
			 *
			 * @details
			 * Copying an EventDispatcher instance does not copy the event listeners attached to it. 
			 * (If your newly created node needs an event listener, you must attach the listener after creating the node.)
			 *
			 * @param eventDispatcher The object to copy
			 */
			EventDispatcher(const EventDispatcher &eventDispatcher);

			/**
			 * @brief Move Constructor
			 *
			 * @param eventDispatcher The object to move
			 */
			EventDispatcher(EventDispatcher &&eventDispatcher);
			virtual ~EventDispatcher() = default;

			/* ----------------------------------------------------------
				ADD-REMOVE EVENT LISTENERS
			---------------------------------------------------------- */
			/**
			 * @brief Register an event listener
			 *
			 * @details 
			 * Registers an event listener object with an EventDispatcher object 
			 * so that the listener receives notification of an event.
			 *
			 * @warning Copying an EventDispatcher instance does not copy the event listeners attached to it.
			 *			(If your newly created node needs an event listener, you must attach the listener after creating the node.) 
			 *			However, if you move an EventDispatcher instance, the event listeners attached to it move along with it.
			 *
			 * @warning If you no longer need an event listener, remove it by calling removeEventListener,
			 *			or EventDispatcher already try to send events to the no longer needed listener and
			 *			it can cause some confliction.
			 *
			 * @param type The type of event.
			 * @param listener The listener function processes the event.
			 */
			void addEventListener(int, void(*listener)(std::shared_ptr<Event>));
			
			/**
			 * @brief Remove a registered event listener
			 *
			 * @details
			 * Removes a listener from the EventDispatcher object. 
			 * If there is no matching listener registered with the EventDispatcher object, a call to this method has no effect
			 *
			 * @param type The type of event.
			 * @param listener The listener function to remove.
			 */
			void removeEventListener(int, void(*listener)(std::shared_ptr<Event>));
			
		protected:
			/* ----------------------------------------------------------
				DISPATCH EVENT
			---------------------------------------------------------- */
			//SEND EVENT
			/**
			 * @brief Dispatches an event to all listeners
			 *
			 * @details
			 * <p> Dispatches an event into the event flow in the background.
			 * The Event::source is the EventDispatcher object upon which the dispatchEvent. </p>
			 *
			 * @param event The Event object that is dispatched into the event flow.
			 * @return Whether there's some listener to listen the event
			 */
			auto dispatchEvent(std::shared_ptr<Event>) -> bool;

			/**
			 * @brief Convenient method of dispatching a progress event
			 *
			 * @details
			 * Dispatches a progress event into the event flow in the background
			 * The Event::source is the EventDispatcher object upon with the dispatchProgressEvent
			 *
			 * @param x The number of current progress
			 * @param size The number of total progress
			 * @return Whether there's some listener to listen the progress event
			 *
			 * @see ProgressEvent
			 * @see EventDispatcher::dispatchEvent
			 */
			auto dispatchProgressEvent(size_t x, size_t size) -> bool;
		};
	};
};