#pragma once
#include <samchon/API.hpp>

namespace samchon
{
	namespace library
	{
		class EventDispatcher;

		class SAMCHON_FRAMEWORK_API BaseEvent
		{
		protected:
			EventDispatcher *source;
			long type;

		public:
			BaseEvent(EventDispatcher *, long);
			virtual ~BaseEvent();

			auto getSource() const->EventDispatcher*;
			auto getType() const -> long;
		};
	};
};