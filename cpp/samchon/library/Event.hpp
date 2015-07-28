#pragma once
#include <samchon\API.hpp>

namespace samchon
{
	namespace library
	{
		class EventDispatcher;

		class SAMCHON_FRAMEWORK_API Event
		{
		public:
			static const long ACTIVATE = 1;
			static const long COMPLETE = 2;
			static const long REMOVED = -1;

		protected:
			EventDispatcher *source;
			long type;

		public:
			Event(EventDispatcher *, long);
			virtual ~Event() = default;

			auto getSource() const -> EventDispatcher*;
			auto getType() const -> long;
		};
	};
};