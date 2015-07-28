#pragma once

#include <samchon/Set.hpp>
#include <samchon/library/RWMutex.hpp>

namespace samchon
{
	namespace library
	{
		template <typename K, typename O = std::less<K>, typename Alloc = std::allocator<K>>
		class CriticalSet :
			public Set<K, O, Alloc>,
			public RWMutex
		{
		private:
			typedef Set<K, O, Alloc> super;

		public:
			/*CriticalSet : Set(K, O, Alloc) {};
			using super::Set();*/

			explicit CriticalSet(const key_compare& comp = key_compare(), const allocator_type& alloc = allocator_type())
				: super(comp, alloc), RWMutex() {};
			explicit CriticalSet(const allocator_type& alloc)
				: super(alloc), RWMutex() {};
			template <class InputIterator> CriticalSet(InputIterator first, InputIterator last, const key_compare& comp = key_compare(), const allocator_type& = allocator_type())
				: super(first, last, comp, allocator_type), RWMutex() {};
			CriticalSet(const Set& x)
				: super(x), RWMutex() {};
			CriticalSet(const Set& x, const allocator_type& alloc)
				: super(x, alloc), RWMutex() {};
			CriticalSet(Set&& x)
				: super(move(x)), RWMutex() {};
			CriticalSet(Set&& x, const allocator_type& alloc)
				: super(move(x), alloc), RWMutex() {};
			CriticalSet(std::initializer_list<value_type> il, const key_compare& comp = key_compare(), const allocator_type& alloc = allocator_type())
				: super(il, comp, alloc), RWMutex() {};

			/* -----------------------------------------------------------------------------
				CAPACITY
				----------------------------------------------------------------------------- */
			auto empty() -> bool
			{
				readLock();
				bool res = super::empty();
				readUnlock();

				return res;
			};
			auto size() -> size_t
			{
				readLock();
				size_t len = super::size();
				readUnlock();

				return len;
			};
			auto max_size() -> size_t
			{
				readLock();
				size_t len = super::max_size();
				readUnlock();

				return len;
			}

			/* -----------------------------------------------------------------------------
				OPERANDS
				----------------------------------------------------------------------------- */
			auto find(const K &key) -> iterator
			{
				readLock();
				iterator &it = super::find(key);
				readUnlock();

				return move(it);
			}
			auto find(const K &key) const -> const_iterator
			{
				readLock();
				const_iterator &it = super::find(key);
				readUnlock();

				return it;
			}
			auto count(const K &key) const -> size_t
			{
				readLock();
				size_t cnt = super::count(key);
				readUnlock();

				return cnt;
			};
			auto has(const K &key) const -> bool
			{
				readLock();
				bool result = super::has(key);
				readUnlock();

				return result;
			};

			/* -----------------------------------------------------------------------------
				MODIFIERS
				----------------------------------------------------------------------------- */
			auto insert(const value_type& val) -> std::pair < iterator, bool >
			{
				writeLock();
				std::pair<iterator, bool> &pair = super::insert(val);
				writeUnlock();

				return move(pair);
			};
			auto insert(value_type&& val) -> std::pair < iterator, bool >
			{
				writeLock();
				std::pair<iterator, bool> &pair = super::insert(move(val));
				writeUnlock();

				return move(pair);
			};
			auto insert(const_iterator position, const value_type& val) -> iterator
			{
				writeLock();
				iterator &it = super::insert(position, val);
				writeUnlock();

				return it;
			};
			auto insert(const_iterator position, value_type&& val) -> iterator
			{
				writeLock();
				iterator &it = super::insert(position, move(val));
				writeUnlock();

				return it;
			};
			template <class InputIterator> void insert(InputIterator first, InputIterator last)
			{
				writeLock();
				super::insert(first, last);
				writeUnlock();
			};
			void insert(std::initializer_list<value_type> il)
			{
				writeLock();
				super::insert(il);
				writeUnlock();
			};

			auto erase(const_iterator position) -> iterator
			{
				writeLock();
				iterator &it = super::erase(position);
				writeUnlock();

				return move(it);
			};
			auto erase(const value_type& val) -> size_t
			{
				writeLock();
				size_t x = super::erase(val);
				writeUnlock();

				return x;
			};
			auto erase(const_iterator first, const_iterator last) -> iterator
			{
				writeLock();
				iterator &it = super::erase(first, last);
				writeUnlock();

				return move(it);
			};

			void clear()
			{
				writeLock();
				super::clear();
				writeUnlock();
			};
			template <class... Args> auto emplace(Args&&... args) -> std::pair < iterator, bool >
			{
				writeLock();
				std::pair<iterator, bool> &pair = super::emplace(args);
				writeUnlock();

				return move(pair);
			}
			template <class... Args> auto emplace_hint(const_iterator position, Args&&... args) -> iterator
			{
				writeLock();
				iterator &it = super::emplace(args);
				writeUnlock();

				return move(it);
			};
		};
	};
};