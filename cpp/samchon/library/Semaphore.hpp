#pragma once
#include <samchon\API.hpp>

namespace std
{
	template <typename _Ty> struct atomic;
	class mutex;
};
namespace samchon
{
	namespace library
	{
		class SAMCHON_FRAMEWORK_API Semaphore
		{
		private:
			size_t _size;

			std::atomic<size_t> *locked;
			std::mutex *mtx;
			std::mutex *minusMtx;

		public:
			Semaphore(size_t = 1);
			~Semaphore();

			auto size() const -> size_t;

			void lock();
			void unlock();
		};
	};
};