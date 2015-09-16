#include <samchon/library/UniqueAcquire.hpp>
#include <samchon/library/Semaphore.hpp>

using namespace samchon::library;

UniqueAcquire::UniqueAcquire(Semaphore &semaphore, bool doLock)
{
	if(doLock == true)
		semaphore.acquire();

	this->semaphore = &semaphore;
	this->isLocked = doLock;
}
UniqueAcquire::~UniqueAcquire()
{
	if(isLocked == true)
		semaphore->release();
}

void UniqueAcquire::acquire()
{
	if(isLocked == true)
		return;

	semaphore->acquire();
	isLocked = true;
}
void UniqueAcquire::release()
{
	if(isLocked == false)
		return;

	semaphore->release();
	isLocked = false;
}