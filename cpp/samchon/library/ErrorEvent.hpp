#pragma once
#include <samchon/API.hpp>
#include <samchon/library/Event.hpp>

#include <samchon/String.hpp>

namespace samchon
{
	namespace library
	{
		/**
		 * @brief Event for expressing Error
		 * @details
		 *
		 * @author Jeongho Nam
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
			ErrorEvent(EventDispatcher *, int);
			virtual ~ErrorEvent() = default;

			auto getID() const -> int;
		};
	};
};