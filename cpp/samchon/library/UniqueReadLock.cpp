#include <samchon/library/RWMutex.hpp>
using namespace samchon::library;

UniqueReadLock::UniqueReadLock(const RWMutex &mtx, bool doLock)
{
	if(doLock == true)
		mtx.readLock();

	this->mtx = &mtx;
	this->isLocked = doLock;
}
UniqueReadLock::~UniqueReadLock()
{
	if(isLocked == true)
		mtx->readUnlock();
}

void UniqueReadLock::lock() const
{
	if(isLocked == true)
		return;

	bool *flag = (bool*)&isLocked;
	
	mtx->readLock();
	*flag = true;
}
void UniqueReadLock::unlock() const
{
	if(isLocked == false)
		return;

	bool *flag = (bool*)&isLocked;

	mtx->readUnlock();
	*flag = false;
}