#pragma once
#include <samchon/SamchonLibrary.hpp>

namespace std
{
	class mutex;
	template<typename _Ty> struct atomic;
	class condition_variable;
};

namespace samchon
{
	using namespace std;

	class SAMCHON_LIBRARY_API RWMutex
	{
	private:
		//대기 상태를 결정지을 변수
		atomic<size_t> *readingCount;
		atomic<bool> *isWriting;

		//대기 유틸리티
		condition_variable *readCV;
		condition_variable *writeCV;

		mutex *readMutex;
		mutex *writeMutex;

	public:
		RWMutex();
		virtual ~RWMutex();

		void readLock() const;
		void readUnlock() const;

		void writeLock();
		void writeUnlock();
	};
};