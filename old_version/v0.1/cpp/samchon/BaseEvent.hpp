#pragma once
#include <samchon/SamchonLibrary.hpp>

namespace samchon
{
	class EventDispatcher;

	class SAMCHON_LIBRARY_API BaseEvent
	{
	protected:
		EventDispatcher *source;
		long type;

	public:
		BaseEvent(EventDispatcher *, long);
		virtual ~BaseEvent();

		auto getSource() const -> EventDispatcher*;
		auto getType() const -> long;
	};
};