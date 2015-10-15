#include <samchon/library/UniqueAcquire.hpp>
#include <samchon/library/Semaphore.hpp>

using namespace samchon::library;

/* -----------------------------------------------------------
	CONSTRUCTORS
----------------------------------------------------------- */
UniqueAcquire::UniqueAcquire(Semaphore &semaphore, bool doLock)
{
	if(doLock == true)
		semaphore.acquire();

	this->semaphore = &semaphore;
	this->isLocked = doLock;
}
UniqueAcquire::UniqueAcquire(UniqueAcquire &&obj)
{
	//MOVE
	this->semaphore = obj.semaphore;
	this->isLocked = obj.isLocked;

	//TRUNCATE
	obj.semaphore = nullptr;
	obj.isLocked = nullptr;
}
UniqueAcquire::~UniqueAcquire()
{
	if(isLocked == true)
		semaphore->release();
}

/* -----------------------------------------------------------
	LOCKERS
----------------------------------------------------------- */
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