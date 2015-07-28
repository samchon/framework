#include <samchon/library/Semaphore.hpp>

#include <atomic>
#include <mutex>

using namespace std;
using namespace samchon::library;

Semaphore::Semaphore(size_t size)
{
	this->_size = size;
	locked = new atomic<size_t>(0);

	mtx = new mutex();
	minusMtx = new mutex();
}
Semaphore::~Semaphore()
{
	delete locked;

	delete mtx;
	delete minusMtx;
}

auto Semaphore::size() const -> size_t
{
	return _size;
}
void Semaphore::lock()
{
	if (locked->operator++() == _size)
		mtx->lock();
}
void Semaphore::unlock()
{
	unique_lock<mutex> uk(*minusMtx);
	if (*locked != 0 && locked->operator--() == _size)
		mtx->unlock();
}
