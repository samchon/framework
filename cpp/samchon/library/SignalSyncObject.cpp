#include <samchon/library/SignalSyncObject.hpp>

samchon::library::SignalSyncObject::SignalSyncObject()
{
	this->mutex = new RWMutex();
	this->mutex->readLock();
}

samchon::library::SignalSyncObject::~SignalSyncObject()
{
	delete this->mutex;
}

void samchon::library::SignalSyncObject::Signal()
{
	this->mutex->readUnlock();
}

void samchon::library::SignalSyncObject::WaitForSignal()
{
	UniqueReadLock lock(*mutex, true);
}
