#include <samchon/Semaphore.hpp>

#include <atomic>
#include <condition_variable>
#include <mutex>

namespace samchon
{
	Semaphore::Semaphore()
	{
		locked = new atomic<size_t>();
		size = new atomic<size_t>();

		referMutex = new mutex();
		cv = new condition_variable();

		locked->store(0);
		size->store(1);
	}
	Semaphore::Semaphore(size_t size)
		: Semaphore()
	{
		this->size->store(size);
	}
	Semaphore::~Semaphore()
	{
		delete size;
		delete locked;
		delete referMutex;
		delete cv;
	}

	auto Semaphore::getSize() const -> size_t
	{
		return size->load();
	}
	void Semaphore::setSize(size_t val)
	{
		size->store(val);
	}

	void Semaphore::lock()
	{
		unique_lock<mutex> uk(*referMutex);

		while (locked->load() >= size->load())
			cv->wait(uk);

		locked->operator++();
	}
	void Semaphore::unlock()
	{
		if (locked->load() == 0)
			return;

		locked->operator--();
		cv->notify_all();
	}
}