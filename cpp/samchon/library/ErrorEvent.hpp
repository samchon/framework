#pragma once
#include <samchon/API.hpp>
#include <samchon/library/Event.hpp>

#include <samchon/String.hpp>

namespace samchon
{
	namespace library
	{
		/**
		 * @brief Event representing an error
		 *
		 * @details [Inherited]
		 * @copydoc Event
		 */
		class SAMCHON_FRAMEWORK_API ErrorEvent 
			: public Event
		{
		public:
			enum TYPES : int
			{
				ERROR = -1
			};

		protected:
			/**
			 * @brief Error id (enumeration)
			 */
			std::string id;

		public:
			/**
			 * @brief Construct from source and error-id
			 * @details The event object owns its source and type
			 *
			 * @param source Source of the event; who made the event
			 * @param id An error-id
			 */
			ErrorEvent(EventDispatcher *, int);
			virtual ~ErrorEvent() = default;

			/**
			 * @brief Get error-id
			 */
			auto getID() const -> int;
		};
	};
};