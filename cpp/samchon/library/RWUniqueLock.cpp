#include <samchon/library/RWMutex.hpp>
using namespace samchon::library;

ReadUniqueLock::ReadUniqueLock(RWMutex &mtx)
{
	mtx.readLock();

	this->mtx = &mtx;
}
ReadUniqueLock::~ReadUniqueLock()
{
	mtx->readUnlock();
}

WriteUniqueLock::WriteUniqueLock(RWMutex &mtx)
{
	mtx.writeLock();

	this->mtx = &mtx;
}
WriteUniqueLock::~WriteUniqueLock()
{
	mtx->writeUnlock();
}