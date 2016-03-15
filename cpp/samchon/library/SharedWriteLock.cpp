#include <API.hpp>

using namespace std;
using namespace samchon::library;

/* -----------------------------------------------------------
CONSTRUCTORS
----------------------------------------------------------- */
SharedWriteLock::SharedWriteLock(RWMutex &semaphore, bool doLock)
{
	if(doLock == true)
		semaphore.writeLock();

	this->semaphore = &semaphore;

	this->reference = new atomic<size_t>(1);
	this->isLocked = new atomic<bool>(doLock);
}
SharedWriteLock::SharedWriteLock(const SharedWriteLock &obj)
{
	obj.reference->operator++();

	this->semaphore = obj.semaphore;
	this->reference = obj.reference;
	this->isLocked = obj.isLocked;
}
SharedWriteLock::SharedWriteLock(SharedWriteLock &&obj)
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

SharedWriteLock::~SharedWriteLock()
{
	if(reference == nullptr || reference->operator--() > 0)
		return;

	if(isLocked->load() == true)
		semaphore->writeUnlock();

	delete reference;
	delete isLocked;
}

/* -----------------------------------------------------------
LOCKERS
----------------------------------------------------------- */
void SharedWriteLock::lock()
{
	if(isLocked->load() == true)
		return;

	semaphore->writeLock();
	isLocked->store(true);
}
void SharedWriteLock::unlock()
{
	if(isLocked->load() == false)
		return;

	semaphore->writeUnlock();
	isLocked->store(false);
}