#include <samchon/library/SharedAcquire.hpp>

#include <atomic>
#include <samchon/library/Semaphore.hpp>

using namespace std;
using namespace samchon::library;

/* -----------------------------------------------------------
	CONSTRUCTORS
----------------------------------------------------------- */
SharedAcquire::SharedAcquire(Semaphore &semaphore, bool doLock)
{
	if(doLock == true)
		semaphore.acquire();

	this->semaphore = &semaphore;

	this->reference = new atomic<size_t>(1);
	this->isLocked = new atomic<bool>(doLock);
}
SharedAcquire::SharedAcquire(const SharedAcquire &obj)
{
	obj.reference->operator++();

	this->semaphore = obj.semaphore;
	this->reference = obj.reference;
	this->isLocked = obj.isLocked;
}
SharedAcquire::SharedAcquire(SharedAcquire &&obj)
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

SharedAcquire::~SharedAcquire()
{
	if(reference == nullptr || reference->operator--() > 0)
		return;
	
	if(isLocked->load() == true)
		semaphore->release();

	delete reference;
	delete isLocked;
}

/* -----------------------------------------------------------
	LOCKERS
----------------------------------------------------------- */
void SharedAcquire::acquire()
{
	if(isLocked->load() == true)
		return;

	semaphore->acquire();
	isLocked->store(true);
}
void SharedAcquire::release()
{
	if(isLocked->load() == false)
		return;

	semaphore->release();
	isLocked->store(false);
}