#pragma once

#include <samchon/Map.hpp>
#include <samchon/library/RWMutex.hpp>

namespace samchon
{
	namespace library
	{
		template <typename _Kty, typename T, typename O = std::less<_Kty>, typename Alloc = std::allocator<std::pair<const _Kty, T>>>
		class CriticalMap
			: public Map<_Kty, T, O, Alloc>,
			public RWMutex
		{
		private:
			typedef Map<_Kty, T, O, Alloc> super;

		public:
			/*CriticalMap() : super() {};
			using super::Map;*/

			//CONSTRUCTORS
			explicit CriticalMap(const key_compare& comp = key_compare(), const allocator_type& alloc = allocator_type())
				: super(comp, alloc), RWMutex() {};
			explicit CriticalMap(const allocator_type& alloc) :
				super(alloc), RWMutex() {};
			template <class InputIterator> CriticalMap(InputIterator first, InputIterator last, const key_compare& comp = key_compare(), const allocator_type &alloc = allocator_type())
				: super(last, comp, alloc), RWMutex() {};
			CriticalMap(const CriticalMap& x)
				: super(x), RWMutex() {}
			CriticalMap(const CriticalMap& x, const allocator_type& alloc)
				: super(x, alloc), RWMutex() {}
			CriticalMap(CriticalMap&& x) :
				super(move(x)), RWMutex() {}
			CriticalMap(CriticalMap&& x, const allocator_type& alloc)
				: super(move(x), alloc), RWMutex() {}
			CriticalMap(std::initializer_list<value_type> il, const key_compare& comp = key_compare(), const allocator_type& alloc = allocator_type())
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
				ACCESS
				----------------------------------------------------------------------------- */
			auto has(const _Kty &key) const -> bool
			{
				readLock();
				bool res = super::has(key);
				readUnlock();

				return res;
			};

			auto operator[](const _Kty& key) -> T&
			{
				return get(key);
			}
			auto operator[](_Kty&& key) -> T&
			{
				return move(get(key));
			}
			auto get(const _Kty &key) const -> const T&
			{
				readLock();
				const T& val = super::get(key);
				readUnlock();

				return val;
			};
			auto get(const _Kty &key) -> T&
			{
				readLock();
				T& val = super::get(key);
				readUnlock();

				return val;
			};

			/* -----------------------------------------------------------------------------
				OPERANDS
				----------------------------------------------------------------------------- */
			auto find(const _Kty &key) -> iterator
			{
				readLock();
				iterator &it = super::find(key);
				readUnlock();

				return move(it);
			}
			auto find(const _Kty &key) const -> const_iterator
			{
				readLock();
				const_iterator &it = super::find(key);
				readUnlock();

				return it;
			}
			auto count(const _Kty &key) const -> size_t
			{
				readLock();
				size_t cnt = super::count(key);
				readUnlock();

				return cnt;
			};

			/* -----------------------------------------------------------------------------
				MODIFIERS
				----------------------------------------------------------------------------- */
			auto set(const _Kty &key, const T &val) -> bool
			{
				return insert({ key, val }).second;
			};
			auto set(const _Kty &key, const T &&val) -> bool
			{
				return insert({ key, move(val) }).second;
			}
			auto pop(const _Kty &key) -> T
			{
				iterator it = find(key);
				T val = move(it->second);

				erase(key);
				return move(val);
			};

			auto insert(const value_type& val) -> std::pair < iterator, bool >
			{
				writeLock();
				std::pair<iterator, bool> &pair = super::insert(val);
				writeUnlock();

				return move(pair);
			};
			template <class P> auto insert(P&& val) -> std::pair < iterator, bool >
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
			template <class P> auto insert(const_iterator position, P&& val) -> iterator
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
			auto erase(const _Kty& val) -> size_t
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