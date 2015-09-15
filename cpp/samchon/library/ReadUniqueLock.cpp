#include <samchon/library/RWMutex.hpp>
using namespace samchon::library;

ReadUniqueLock::ReadUniqueLock(const RWMutex &mtx, bool doLock)
{
	if(doLock == true)
		mtx.readLock();

	this->mtx = &mtx;
	this->isLocked = doLock;
}
ReadUniqueLock::~ReadUniqueLock()
{
	if(isLocked == true)
		mtx->readUnlock();
}

void ReadUniqueLock::lock() const
{
	if(isLocked == true)
		return;

	bool *flag = (bool*)&isLocked;
	
	mtx->readLock();
	*flag = true;
}
void ReadUniqueLock::unlock() const
{
	if(isLocked == false)
		return;

	bool *flag = (bool*)&isLocked;

	mtx->readUnlock();
	*flag = false;
}