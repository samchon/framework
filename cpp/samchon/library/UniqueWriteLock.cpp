#include <API.hpp>

using namespace samchon::library;

/* -----------------------------------------------------------
	CONSTRUCTORS
----------------------------------------------------------- */
UniqueWriteLock::UniqueWriteLock(RWMutex &mtx, bool doLock)
{
	if(doLock == true)
		mtx.writeLock();

	this->mtx = &mtx;
	this->isLocked = doLock;
}
UniqueWriteLock::UniqueWriteLock(UniqueWriteLock &&obj)
{
	//MOVE
	this->mtx = obj.mtx;
	this->isLocked = obj.isLocked;

	//TRUNCATE
	obj.mtx = nullptr;
	obj.isLocked = nullptr;
}
UniqueWriteLock::~UniqueWriteLock()
{
	if(isLocked == true)
		mtx->writeUnlock();
}

/* -----------------------------------------------------------
	LOCKERS
----------------------------------------------------------- */
void UniqueWriteLock::lock()
{
	if(isLocked == true)
		return;
	
	mtx->writeLock();
	isLocked = true;
}
void UniqueWriteLock::unlock()
{
	if(isLocked == false)
		return;
	
	mtx->writeUnlock();
	isLocked = false;
}