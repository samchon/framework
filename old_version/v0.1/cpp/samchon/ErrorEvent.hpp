#pragma once
#include <samchon/SamchonLibrary.hpp>

#include <samchon/BaseEvent.hpp>

namespace samchon
{
	class SAMCHON_LIBRARY_API ErrorEvent : public BaseEvent
	{
	protected:
		long id;

	public:
		enum
		{
			ERROR_OCCURED = -1
		};

		ErrorEvent(EventDispatcher *, long, long);

		auto getID() const -> long;
	};
};