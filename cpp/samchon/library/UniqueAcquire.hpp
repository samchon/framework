#pragma once


namespace samchon
{
	namespace library
	{
		class Semaphore;

		/**
		 * @brief Unique acquire from a semaphore
		 *
		 * @details
		 * \par
		 * A UniqueAcquire is an object manages a Semaphore
		 * with unique ownership in both states: acquired and released.
		 *
		 * \par
		 * On construction (or by move-assigning to it), the object acquires
		 * a semaphore object, for whose acquiring and releasing operations becomes 
		 * responsible.
		 *
		 * \par
		 * The object supports both states: acquired and released.
		 *
		 * \par
		 * This class guarantees a released status on destruction
		 * (even if not called explicitly). Therefore it is especially useful as an object
		 * with automatic duration, as it guarantees the semaphore object is properly 
		 * released in case an exception is thrown.
		 *
		 * \par
		 * Referenced comments of std::unique_lock
		 *	\li http://www.cplusplus.com/reference/mutex/unique_lock/
		 *
		 * @warning
		 * Though, that the UniqueAcquire object does not manage the lifetime of the semaphore
		 * object in any way: the duration of the semaphore object shall extend at least until
		 * the destruction of the UniqueAcquire that manages it.
		 *
		 * @author Jeongho Nam
		 */
		class  UniqueAcquire
		{
		private:
			/**
			 * @brief Managed semaphore
			 */
			Semaphore *semaphore;

			/**
			 * @brief Whether the mutex was locked by UniqueLock
			 */
			bool isLocked;

		public:
			/* ===================================================
				CONSTRUCTORS
			=================================================== */
			/**
			 * @brief Construct from semaphore
			 *
			 * @param semaphore Semaphore to manage
			 * @param doLock Whether to lock directly or not
			 */
			UniqueAcquire(Semaphore &, bool = true);

			/**
			 * @brief Destructor
			 *
			 * @details
			 * If read lock has done by the UniqueLock, unlock it
			 */
			~UniqueAcquire();

			/* ===================================================
				LOCKERS
			=================================================== */
			/**
			 * @copydoc Semaphore::acquire()
			 */
			void acquire();

			/**
			 * @copydoc Semaphore::release()
			 */
			void release();

			/**
			 * @copydoc Semaphore::tryAcquire()
			 */
			auto tryAcquire() const -> bool;
		};
	};
};