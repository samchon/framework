#pragma once
#include <samchon/library/Event.hpp>

namespace samchon
{
	namespace library
	{
		class SAMCHON_FRAMEWORK_API ProgressEvent
			: public Event
		{
		public:
			static const long PROGRESS = 11;

		protected:
			long long numerator;
			long long denominator;

		public:
			ProgressEvent(EventDispatcher *, long, long long, long long);
			ProgressEvent(EventDispatcher *, long long, long long);
			virtual ~ProgressEvent() = default;

			auto getNumerator() const -> long long;
			auto getDenominator() const -> long long;
			auto getPercent() const -> double;
		};
	};
};