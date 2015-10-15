#include <samchon/library/SharedReadLock.hpp>

#include <atomic>
#include <samchon/library/RWMutex.hpp>

using namespace std;
using namespace samchon::library;

/* -----------------------------------------------------------
	CONSTRUCTORS
----------------------------------------------------------- */
SharedReadLock::SharedReadLock(const RWMutex &semaphore, bool doLock)
{
	if(doLock == true)
		semaphore.readLock();

	this->semaphore = &semaphore;

	this->reference = new atomic<size_t>(1);
	this->isLocked = new atomic<bool>(doLock);
}
SharedReadLock::SharedReadLock(const SharedReadLock &obj)
{
	obj.reference->operator++();

	this->semaphore = obj.semaphore;
	this->reference = obj.reference;
	this->isLocked = obj.isLocked;
}
SharedReadLock::SharedReadLock(SharedReadLock &&obj)
{
	//MOVE
	this->semaphore = obj.semaphore;
	this->reference = obj.reference;
	this->isLocked = obj.isLocked;

	//TRUNCATE
	obj.semaphore = nullptr;
	obj.reference = nullptr;
	obj.isLocked = nullptr;
}

SharedReadLock::~SharedReadLock()
{
	if(reference == nullptr || reference->operator--() > 0)
		return;

	if(isLocked->load() == true)
		semaphore->readUnlock();

	delete reference;
	delete isLocked;
}

/* -----------------------------------------------------------
	LOCKERS
----------------------------------------------------------- */
void SharedReadLock::lock() const
{
	if(isLocked->load() == true)
		return;

	semaphore->readLock();
	isLocked->store(true);
}
void SharedReadLock::unlock() const
{
	if(isLocked->load() == false)
		return;

	semaphore->readUnlock();
	isLocked->store(false);
}