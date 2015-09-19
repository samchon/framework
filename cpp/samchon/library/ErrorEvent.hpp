#pragma once
#include <samchon/API.hpp>

#include <samchon/library/Event.hpp>

#include <string>

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
				ERROR = 0
			};

		protected:
			/**
			 * @brief Error message
			 */
			std::string message;

		public:
			/**
			 * @brief Construct from source and error-id
			 * @details The event object owns its source and type
			 *
			 * @param source Source of the event; who made the event
			 * @param id An error-id
			 */
			ErrorEvent(EventDispatcher *, const std::string &);
			virtual ~ErrorEvent() = default;

			/**
			 * @brief Get error-id
			 */
			auto getMessage() const -> std::string;
		};
	};
};