#pragma once
#include <samchon\API.hpp>

#include <atomic>
#include <mutex>
#include <condition_variable>

#include <samchon/library/ReadUniqueLock.hpp>
#include <samchon/library/WriteUniqueLock.hpp>

namespace std
{
	template <typename _Ty> struct atomic;
	class condition_variable;
	class mutex;
};
namespace samchon
{
	namespace library
	{
		/**
		 * @brief rw_mutex
		 *
		 * @details
		 * A mutex divided into reading and writing
		 * 
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API RWMutex
		{
		private:
			//Status variables
			std::atomic<size_t> *readingCount;
			std::atomic<bool> *isWriting;
			std::mutex *minusMtx;

			//Lockers
			std::condition_variable *cv;
			std::mutex *readMtx;
			std::mutex *writeMtx;

		public:
			/**
			 * @brief Default Constructor
			 */
			RWMutex();
			~RWMutex();

			/**
			 * @brief Lock on read
			 * 
			 * @details
			 * \par Increases a reading count.
			 * \par When write_lock is on a progress, wait until write_unlock to be called.
			 *	\li Reading can be done by multiple sections.
			 *	\li Reading can't be done when writing.
			 *
			 * @warning You've to call read_unlock when the reading work is terminated.
			 */
			void readLock() const;

			/**
			 * @brief Unlock of read
			 *
			 * @details
			 * \par Decreases a reading count.
			 *
			 * \par 
			 * When write_lock had done after read_lock, it continues by read_unlock 
			 * if the reading count was 1 (read_unlock makes the count to be zero).
			 */
			void readUnlock() const;

			/**
			 * @brief Lock on writing
			 * 
			 * @details
			 * \par Changes writing flag to true.
			 *
			 * \par
			 * If another write_lock or read_lock is on a progress, wait until them to be unlocked
			 *	\li Writing can be done by only a section at once.
			 *	\li Writing can't be done when reading.
			 *
			 * @warning You've to call write_unlock when writing work was terminated.
			 */
			void writeLock();

			/**
			 * @brief Unlock on writing
			 */
			void writeUnlock();
		};
	};
};