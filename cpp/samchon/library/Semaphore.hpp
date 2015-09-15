#pragma once


namespace std
{
	template <typename _Ty> struct atomic;
	class mutex;
};
namespace samchon
{
	namespace library
	{
		/**
		 * @brief Semaphore
		 *
		 * 
		 */
		class  Semaphore
		{
		private:
			/**
			 * @brief The size
			 * @details Permitted size of the semaphore
			 */
			size_t size_;

			/* ====================================================
				VARIABLES FOR LOCK
			==================================================== */
			/**
			 * @brief Acquired count
			 */
			size_t acquired;
			std::mutex *countMtx;

			/**
			 * @brief Locker
			 * @details Manages lock and unlock of the semaphore
			 */
			std::mutex *mtx;

		public:
			/**
			 * Constructor.
			 *
			 * @param size The size of the semaphore to permit
			 */
			Semaphore(size_t = 1);
			~Semaphore();

			/* ====================================================
				GETTERS
			==================================================== */
			/**
			 * @brief Get size
			 * @details Returns size which means the permitted count of the semaphore
			 *
			 * @return The size of semaphore
			 */
			auto size() const -> size_t;
			auto acquiredSize() const -> size_t;

			/* ====================================================
				LOCKERS
			==================================================== */
			/**
			 * @brief Acquire admission
			 *
			 * @details
			 * <p> Acquires an admission and increases count of admission by 1. </p> 
			 * <p> If the count is over permitted size, wait until other admissions to be released. </p>
			 *	\li Lock on mutex
			 */
			void acquire();

			/**
			 * @brief Try to acquire admission
			 * 
			 * @details
			 * <p> If admission count is below the permitted size, acquire admission and increase the 
			 * count by 1 and return true which means succeded to get admission. </p>
			 *
			 *	\li If the count is matched to the permitted size, lock the mutex
			 * 
			 * <p> Else, do not acquire admission and return false which means failed to get admmission. </p>
			 *
			 * @return Whether succeded to acquire an admission or not
			 */
			auto tryAcquire() -> bool;

			/**
			 * @brief Release an admission
			 *
			 * @details 
			 * Releases an admission what you've acquired.
			 * If the admission count was over the limited size, unlock the mutex.
			 */
			void release();
		};
	};
};

#include <samchon/library/UniqueAcquire.hpp>