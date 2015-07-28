#include <samchon/library/RWMutex.hpp>
using namespace samchon::library;

RWUniqueLock::RWUniqueLock(RWMutex &mtx, int direction)
{
	if (direction == READ)
		mtx.readLock();
	else if (direction == WRITE)
		mtx.writeLock();

	this->mtx = &mtx;
	this->direction = direction;
}
RWUniqueLock::~RWUniqueLock()
{
	if (direction == READ)
		mtx->readUnlock();
	else if (direction == WRITE)
		mtx->writeUnlock();
}

ReadUniqueLock::ReadUniqueLock(RWMutex &mtx)
	: super(mtx, READ)
{
}
WriteUniqueLock::WriteUniqueLock(RWMutex &mtx)
	: super(mtx, WRITE)
{
}