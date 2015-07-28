#pragma once
#include <allocators>
#include <samchon/library/RWMutex.hpp>

#include <iostream>

namespace samchon
{
	namespace library
	{
		template <class _Ty>
		class CriticalAllocator
			: public std::allocator<_Ty>
		{
		private:
			typedef std::allocator<_Ty> super;

			RWMutex mtx;

		public:
			using super::allocator;
			
			template <typename U> struct rebind
			{
				typedef CriticalAllocator<U> other;
			};

			void construct(pointer p, const_reference val)
			{
				mtx.writeLock();
					super::construct(p, val);
				mtx.writeUnlock();
			};
			void deallocate(pointer ptr, size_type size)
			{
				mtx.writeLock();
					super::deallocate(ptr, size);
				mtx.writeUnlock();
			};
		};
	};
};