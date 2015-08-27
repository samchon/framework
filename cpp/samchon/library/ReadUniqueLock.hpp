#pragma once
#include <samchon\API.hpp>

namespace samchon
{
	namespace library
	{
		class RWMutex;

		/**
		 * @brief Unique lock for reading
		 * 
		 * @details
		 * \par 
		 * A ReadUniqueLock is an object manages a RWMutex object on reading
		 * with unique ownership in both states: locked and unlocked.
		 * 
		 * \par 
		 * On construction (or by move-assigning to it), the object acquires 
		 * a mutex object, for whose locking and unlocking operations becomes responsible.
		 *
		 * \par
		 * The object supports both states: locked and unlocked.
		 *
		 * \par
		 * This class guarantees an unlocked status on destruction 
		 * (even if not called explicitly). Therefore it is especially useful as an object 
		 * with automatic duration, as it guarantees the mutex object is properly unlocked 
		 * in case an exception is thrown.
		 *
		 * \par
		 * Referenced comments of std::unique_lock
		 *	\li http://www.cplusplus.com/reference/mutex/unique_lock/
		 *
		 * @warning
		 * Though, that the ReadUniqueLock object does not manage the lifetime of the mutex 
		 * object in any way: the duration of the mutex object shall extend at least until 
		 * the destruction of the ReadUniqueLock that manages it.
		 *
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API ReadUniqueLock
		{
		private:
			/**
			 * @brief Managed mutex
			 */
			const RWMutex *mtx;

			/**
			 * @brief Whether the mutex was locked by UniqueLock
			 */
			bool isLocked;

		public:
			/* ===================================================
				CONSTRUCTORS
			=================================================== */
			/**
			 * @brief Construct from mutex
			 * 
			 * @param mtx Mutex to manage
			 * @param doLock Whether to lock directly or not
			 */
			ReadUniqueLock(const RWMutex &, bool = true);

			/**
			 * @brief Destructor
			 *
			 * @details
			 * If read lock has done by the UniqueLock, unlock it
			 */
			~ReadUniqueLock();

			/* ===================================================
				LOCKERS
			=================================================== */
			/**
			 * @copydoc RWMutex::readLock()
			 */
			void lock() const;

			/**
			 * @copydoc RWMutex::readUnlock()
			 */
			void unlock() const;

			/**
			 * @copydoc RWMutex::tryReadLock()
			 */
			auto tryLock() const -> bool;
		};
	};
};