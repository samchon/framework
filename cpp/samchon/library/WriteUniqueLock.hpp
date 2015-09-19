#pragma once
#include <samchon/API.hpp>

namespace samchon
{
	namespace library
	{
		class RWMutex;

		/**
		 * @brief Unique lock for writing
		 *
		 * @details
		 * <p> A WriteUniqueLock is an object manages a RWMutex object on writing
		 * with unique ownership in both states: locked and unlocked. </p>
		 *
		 * <p> On construction (or by move-assigning to it), the object acquires
		 * a mutex object, for whose locking and unlocking operations becomes responsible. </p>
		 *
		 * <p> The object supports both states: locked and unlocked. </p>
		 *
		 * <p> This class guarantees an unlocked status on destruction
		 * (even if not called explicitly). Therefore it is especially useful as an object
		 * with automatic duration, as it guarantees the mutex object is properly unlocked
		 * in case an exception is thrown. </p>
		 *
		 * <p> Referenced comments of std::unique_lock </p>
		 *	\li http://www.cplusplus.com/reference/mutex/unique_lock/
		 *
		 * @warning
		 * Though, that the WriteUniqueLock object does not manage the lifetime of the mutex
		 * object in any way: the duration of the mutex object shall extend at least until
		 * the destruction of the WriteUniqueLock that manages it.
		 *
		 * @author Jeongho Nam
		 */
		class SAMCHON_FRAMEWORK_API WriteUniqueLock
		{
		private:
			/**
			 * @brief Managed mutex
			 */
			RWMutex *mtx;

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
			WriteUniqueLock(RWMutex &, bool = true);

			/**
			 * @brief Destructor
			 *
			 * @details
			 * If write lock has done by the UniqueLock, unlock it
			 */
			~WriteUniqueLock();

			/* ===================================================
				LOCKERS
			=================================================== */
			/**
			 * @copydoc RWMutex::writeLock()
			 */
			void lock();

			/**
			 * @copydoc RWMutex::writeUnlock()
			 */
			void unlock();

			/**
			 * @copydoc RWMutex::tryLock()
			 */
			//auto tryLock() -> bool;
		};
	};
};