#include <samchon/RWMutex.hpp>

#include <atomic>
#include <mutex>
#include <condition_variable>

namespace samchon
{
	RWMutex::RWMutex()
	{
		readingCount = new atomic<size_t>();
		isWriting = new atomic<bool>();

		readCV = new condition_variable();
		writeCV = new condition_variable();

		readMutex = new mutex();
		writeMutex = new mutex();

		*readingCount = 0;
		*isWriting = false;
	}
	RWMutex::~RWMutex()
	{
		delete readingCount;
		delete isWriting;

		delete readCV;
		delete writeCV;

		delete readMutex;
		delete writeMutex;
	}

	void RWMutex::readLock() const
	{
		unique_lock<mutex> uk(*readMutex);
		while (*isWriting)
			readCV->wait(uk);

		readingCount->operator++();
	};
	void RWMutex::readUnlock() const
	{
		//읽기 언락을 너무 많이 했을 때를 대비하여
		if (readingCount->load() > 0)
			readingCount->operator--();

		//읽기언락은 쓰기락에게만 알려도 된다.
		writeCV->notify_all();
	};

	void RWMutex::writeLock()
	{
		unique_lock<mutex> uk(*writeMutex);

		//이미 쓰기락이 걸려있거나, 
		//읽기락이 걸려있는 상태엔 대기
		while (*isWriting || *readingCount > 0)
			writeCV->wait(uk);

		*isWriting = true;
	};
	void RWMutex::writeUnlock()
	{
		*isWriting = false;

		//쓰기 언락은 읽기-쓰기락이 모두 알아야 할 정보
		readCV->notify_all();
		writeCV->notify_all();
	};
}