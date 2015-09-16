#pragma once

#include <samchon/BaseEvent.hpp>

namespace samchon
{
	class SAMCHON_LIBRARY_API ProgressEvent : public BaseEvent
	{
	public:
		enum
		{
			PROGRESS = 1
		};

	protected:
		long long numerator;
		long long denominator;

	public:
		ProgressEvent(EventDispatcher *, long, long long, long long);
		ProgressEvent(EventDispatcher *, long long, long long);
		
		auto getNumerator() const -> long long;
		auto getDenominator() const -> long long;
		auto getPercent() const -> double;
	};
};