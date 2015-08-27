#pragma once
#include <memory>
#include <mutex>

namespace samchon
{
	namespace library
	{
		/**
		 * @brief The allocator ensuring concurrency\n
		 *		  [Inherited] Default allocator
		 * 
		 * @details
		 * \par 
		 * CriticalAllocator is the std::allocator ensuring concurrency
		 *
		 * \par [Inherited] 
		 * Allocators are classes that define memory models to be used by 
		 * some parts of the Standard Library, and most specifically, by STL containers.
		 *
		 * \par
		 * This section describes the default allocator template allocator (lowercase). 
		 * This is the allocator that all standard containers will use if their last (and optional) 
		 * template parameter is not specified, and is the only predefined allocator in the standard library.
		 *
		 * \par
		 * Other allocators may be defined. Any class Alloc for which allocator_traits<Alloc> 
		 * produces a valid instantiation with the appropriate members defined can be used 
		 * as an allocator on standard containers (Alloc may or may not implement the functionality through member functions).
		 *
		 * \par
		 * Except for its destructor, no member of the standard default allocator class template shall introduce data races. 
		 * Calls to member functions that allocate or deallocate storage shall occur in a single total order, 
		 * and each such deallocation shall happen before the next allocation (if any) in this order.
		 *
		 * \par
		 * Technically, a memory model described by allocators might be specialized for each type of 
		 * object to be allocated and even may store local data for each container they work with. 
		 * Although this does not happen with the default allocator.
		 *
		 * \par
		 * Referenced comments of std::allocator
		 *	\li http://www.cplusplus.com/reference/memory/allocator/
		 *
		 * @tparam _Ty Type of the elements allocated by the object (aliased as member type value_type).
		 * @author Jeongho Nam
		 */
		template <class _Ty>
		class CriticalAllocator
			: public std::allocator<_Ty>
		{
		private:
			typedef std::allocator<_Ty> super;

			/**
			 * @brief A mutex for handling concurrency
			 */
			std::mutex mtx;

		public:
			/**
			 * @brief Inherits all constructors.
			 */
			using super::allocator;

			template <typename U> struct rebind
			{
				typedef CriticalAllocator<U> other;
			};

			/* ---------------------------------------------------------------
				SINGLE ELEMENT'S CONSTRUCTION AND DESTRUCTION
			--------------------------------------------------------------- */
			/**
			 * @brief Lock when constructed.\n
			 *		  [Inherited] Construct an object.\n
			 *
			 * @details
			 * \par 
			 * Locks a mutex for concurrency when an elmented is constructed.
			 *
			 * \par [Inherited] 
			 * Constructs an element object on the location pointed by p
			 *
			 * \par
			 * Notice that this does not allocate space for the element. 
			 * It should already be available at p (see member allocate to allocate space).
			 *
			 * @tparam _U
			 * @tparam _Args
			 *
			 * @param ptr Pointer to a location with enough storage space to contain an element of type _U.
			 * @param args Arguments forwarded to the constructor.\n
			 *			   Args is a list of zero or more types.
			 */
			template<class _U, class... _Args>
			void construct(_U *ptr, _Args&&... args)
			{
				std::unique_lock<std::mutex> uk(mtx);
				
				super::construct(ptr, args);
			};

			/**
			 * @brief Lock when destroyed\n
			 *		  [Inherited] Destory an object
			 *
			 * @details 
			 * \par 
			 * Locks a mutex for concurrency when an child is destroyed
			 *
			 * \par [Inherited] 
			 * Destroys in-place the object pointed by p.
			 *
			 * \par
			 * Notice that this does not deallocate the storage for the element 
			 * (see member deallocate to release storage space).
			 *
			 * @tparam _U
			 * @param ptr Pointer to the object to be destroyed.
			 */
			template<class _U>
			void destroy(_U *ptr)
			{
				std::unique_lock<std::mutex> uk(mtx);

				super::destroy(ptr);
			};

			/* ---------------------------------------------------------------
				MULTIPLE ELEMENT'S ALLOCATION AND DEALLOCATION
			--------------------------------------------------------------- */
			/**
			 * @brief Lock when allocated\n
			 *		  [Inherited] Allocate block of storage
			 *
			 * @details
			 * \par 
			 * Locks a mutex for concurrency when children elements are deallocated.
			 *
			 * \par [Inherited]
			 * Attempts to allocate a block of storage with a size large enough to contain n elements 
			 * of member type value_type (an alias of the allocator's template parameter), 
			 * and returns a pointer to the first element.
			 *
			 * \par
			 * The storage is aligned appropriately for objects of type value_type, but they are not constructed.
			 *
			 * \par
			 * In the standard default allocator, the block of storage is allocated using ::operator 
			 * new one or more times, and throws bad_alloc if it cannot allocate the total amount of storage requested.
			 *
			 * @param n Number of elements (each of size sizeof(value_type)) to be allocated.\n
			 *			The member type size_type is an alias of size_t (in the standard default allocator) size_t is an unsigned integral type.
			 * @param hint Either 0 or a value previously obtained by another call to allocate and not yet freed with deallocate.
			 *			   When it is not 0, this value may be used as a hint to improve performance by allocating the new block near the one specified. 
			 *			   The address of an adjacent element is often a good choice.
			 * @return 
			 * \par A pointer to the initial element in the block of storage.
			 * \par pointer and const_pointer are member types (defined as aliases of T* and const T* respectively in std::allocator<T>).
			 * \par The standard default allocator throws bad_alloc if it cannot allocate the requested amount of storage.
			 */
			auto allocate(size_type n, std::allocator<void>::const_pointer hint = NULL) -> pointer
			{
				std::unique_lock<std::mutex> uk(mtx);

				super::allocate(n, hint);
			};

			/**
			 * @brief Lock when deallocated\n
			 *		  [Inherited] Release block of storage
			 *
			 * @details
			 * \par Locks a mutex for concurrency when children elements are deallocated
			 *
			 * \par [Inherited] 
			 * Releases a block of storage previously allocated with member allocate and not yet released.
			 *
			 * \par 
			 * The elements in the array are not destroyed by a call to this member function.
			 *
			 * \par 
			 * In the default allocator, the block of storage is at some point deallocated 
			 * using ::operator delete (either during the function call, or later).
			 *
			 * @param ptr Pointer to a block of storage previously allocated with allocator::allocate.\n
			 *			  pointer is a member type (defined as an alias of T* in std::allocator<_Ty>).
			 * @param size Number of elements allocated on the call to allocator::allocate for this block of storage.
			 *			   The member type size_type is an alias of size_t (in the standard default allocator). 
			 *			   size_t is an unsigned integral type.
			 */
			void deallocate(pointer ptr, size_type size)
			{
				std::unique_lock<std::mutex> uk(mtx);
				
				super::deallocate(ptr, size);
			};
		};
	};
};