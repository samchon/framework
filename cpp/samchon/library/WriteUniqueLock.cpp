#include <samchon/library/RWMutex.hpp>
using namespace samchon::library;

WriteUniqueLock::WriteUniqueLock(RWMutex &mtx, bool doLock)
{
	if(doLock == true)
		mtx.writeLock();

	this->mtx = &mtx;
	this->isLocked = doLock;
}
WriteUniqueLock::~WriteUniqueLock()
{
	if(isLocked == true)
		mtx->readUnlock();
}

void WriteUniqueLock::lock()
{
	if(isLocked == true)
		return;
	
	mtx->writeLock();
	isLocked = true;
}
void WriteUniqueLock::unlock()
{
	if(isLocked == false)
		return;
	
	mtx->writeUnlock();
	isLocked = false;
}