#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <samchon/BaseEvent.hpp>

namespace samchon
{
	class SAMCHON_LIBRARY_API Event : public BaseEvent
	{
	public:
		enum
		{
			ACTIVATE = 1,
			COMPLETE = 2,
			REMOVED = -1
		};
	
		Event(EventDispatcher *, long);
	};
};