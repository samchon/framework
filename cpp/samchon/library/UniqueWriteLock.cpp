#include <samchon/library/RWMutex.hpp>
using namespace samchon::library;

UniqueWriteLock::UniqueWriteLock(RWMutex &mtx, bool doLock)
{
	if(doLock == true)
		mtx.writeLock();

	this->mtx = &mtx;
	this->isLocked = doLock;
}
UniqueWriteLock::~UniqueWriteLock()
{
	if(isLocked == true)
		mtx->readUnlock();
}

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