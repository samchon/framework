#include <samchon/library/RWMutex.hpp>
using namespace samchon::library;

/* -----------------------------------------------------------
	CONSTRUCTORS
----------------------------------------------------------- */
UniqueReadLock::UniqueReadLock(const RWMutex &mtx, bool doLock)
{
	if(doLock == true)
		mtx.readLock();

	this->mtx = &mtx;
	this->isLocked = doLock;
}
UniqueReadLock::UniqueReadLock(UniqueReadLock &&obj)
{
	//MOVE
	this->mtx = obj.mtx;
	this->isLocked = obj.isLocked;

	//TRUNCATE
	obj.mtx = nullptr;
	obj.isLocked = nullptr;
}
UniqueReadLock::~UniqueReadLock()
{
	if(isLocked == true)
		mtx->readUnlock();
}

/* -----------------------------------------------------------
	LOCKERS
----------------------------------------------------------- */
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