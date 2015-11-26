#pragma once

#include <samchon/library/RWMutex.hpp>
#include <samchon/library/UniqueReadLock.hpp>

namespace samchon
{
	namespace library
	{
		class SignalSyncObject
		{
		private:
			RWMutex *mutex;

		public:
			SignalSyncObject();
			virtual ~SignalSyncObject();

			void Signal();
			void WaitForSignal();
		};
	}
}
