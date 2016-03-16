#include <samchon/library/Semaphore.hpp>

#include <atomic>
#include <mutex>

using namespace std;
using namespace samchon::library;

/* ====================================================
	CONSTRUCTORS
==================================================== */
Semaphore::Semaphore(size_t size)
{
	this->size_ = size;
	this->acquired = 0;

	mtx = new mutex();
	countMtx = new mutex();
}
Semaphore::~Semaphore()
{
	delete mtx;
	delete countMtx;
}

void Semaphore::setSize(size_t val)
{
	unique_lock<mutex> uk(*countMtx);

	this->size_ = val;
}

/* ====================================================
	GETTERS
==================================================== */
auto Semaphore::size() const -> size_t
{
	return size_;
}
auto Semaphore::acquiredSize() const -> size_t
{
	unique_lock<mutex> uk(*countMtx);

	return acquired;
}

/* ====================================================
	LOCKERS
==================================================== */
void Semaphore::acquire()
{
	unique_lock<mutex> uk(*countMtx);

	if (++acquired >= size_)
	{
		uk.unlock();
		mtx->lock();
	}
}
auto Semaphore::tryAcquire() -> bool
{
	unique_lock<mutex> uk(*countMtx);
	
	if (acquired == size_)
		return false;
	else
	{
		if (++acquired >= size_)
			return mtx->try_lock();
		
		return true;
	}
}

void Semaphore::release()
{
	unique_lock<mutex> uk(*countMtx);

	if (acquired != 0 && --acquired == size_ - 1)
		mtx->unlock();
}
