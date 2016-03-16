#include <samchon/library/RWMutex.hpp>

#include <atomic>
#include <mutex>
#include <condition_variable>

using namespace std;
using namespace samchon::library;

RWMutex::RWMutex()
{
	readingCount = new atomic<size_t>(0);
	isWriting = new atomic<bool>(false);

	cv = new condition_variable();
	readMtx = new mutex();
	writeMtx = new mutex();
	minusMtx = new mutex();
}
RWMutex::~RWMutex()
{
	delete readingCount;
	delete isWriting;

	delete readMtx;
	delete writeMtx;
	delete minusMtx;
	delete cv;
}

void RWMutex::readLock() const
{
	unique_lock<mutex> uk(*readMtx);
	while (*isWriting == true)
		cv->wait(uk);

	readingCount->operator++();
}
void RWMutex::readUnlock() const
{
	unique_lock<mutex> uk(*minusMtx);

	//차감 전 이미 0 (과도한 readUnlock 수행) 은 안 됨
	if (
			*readingCount != 0 &&
			readingCount->operator--() == 0
		)
	{
		cv->notify_all();
	}
}

void RWMutex::writeLock()
{
	unique_lock<mutex> uk(*writeMtx);
	while (*isWriting == true || *readingCount > 0)
		cv->wait(uk);

	isWriting->store( true );
}
void RWMutex::writeUnlock()
{
	isWriting->store( false );
	cv->notify_all();
}