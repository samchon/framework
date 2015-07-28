#pragma once
#include <samchon\API.hpp>
#include <samchon/library/Event.hpp>

namespace samchon
{
	namespace library
	{
		class SAMCHON_FRAMEWORK_API ErrorEvent 
			: public Event
		{
		public:
			static const long ERROR_OCCURED = -1;

		protected:
			long id;

		public:
			ErrorEvent(EventDispatcher *, long, long);
			virtual ~ErrorEvent() = default;

			auto getID() const -> long;
		};
	};
};