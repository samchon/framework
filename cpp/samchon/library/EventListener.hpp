#pragma once

#include <samchon/library/Event.hpp>


namespace samchon
{
	namespace library
	{

		class EventListener
		{
		private:
			bool sActivated;
		public:
			EventListener(bool Active = true);

			virtual void Dispatch(Event *) = 0;
			auto isActivated() -> bool;
		
		};
	}
}