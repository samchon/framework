#pragma once
#include <samchon\API.hpp>

namespace samchon
{
	namespace library
	{
		class EventDispatcher;

		/**
		 * @brief Event running on background.
		 *
		 * @details
		 * \par
		 * The Event class is used as the base class for the creation of Event objects, 
		 * which are passed as parameters to event listeners when an event occurs.  
		 *
		 * \par
		 * The properties of the Event class carry basic information about an event, 
		 * such as the event's type or source (who made the event) of the event. 
		 *
		 * \par
		 * For many events, such as the events represented by the Event class constants, this basic 
		 * information is sufficient. Other events, however, may require more detailed information.
		 *
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API Event
		{
		public:
			enum TYPES : int
			{
				ACTIVATE = 1,
				COMPLETE = 2,
				REMOVED = -1
			};

		protected:
			/**
			 * @brief Source of the event
			 */
			EventDispatcher *source;

			/**
			 * @brief Type of the event
			 */
			int type;

		public:
			/**
			 * @brief Construct from source and type
			 * @details The event object owns its source and type
			 *
			 * @param source Source of the event; who made the event
			 * @param type Type of the event
			 */
			Event(EventDispatcher*, int);
			virtual ~Event() = default;
			
			auto getSource() const -> EventDispatcher*;
			auto getType() const -> int;
		};
	};
};