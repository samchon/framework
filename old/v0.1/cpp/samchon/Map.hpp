#pragma once

#include <map>

namespace samchon
{
	using namespace std;

	template <typename K, typename T, typename O = less<K>, typename Alloc = allocator<pair<const K, T>>>
	class Map : public map<K, T, O, Alloc>
	{
	private:
		typedef map<K, T, O, Alloc> super;

		inline auto at(const K &key) const -> const T&
		{
			return super::at(key);
		};
		inline auto at(const K &key) -> T&
		{
			return super::at(key);
		};

	public:
		/*Map() : super() {};
		using super::map;*/

		//CONSTRUCTORS
		explicit Map(const key_compare& comp = key_compare(), const allocator_type& alloc = allocator_type()) : super(comp, alloc) {};
		explicit Map(const allocator_type& alloc) : super(alloc) {};

		template <class InputIterator>
		Map(InputIterator first, InputIterator last, const key_compare& comp = key_compare(), const allocator_type &alloc = allocator_type())
			: super(last, comp, alloc) {};

		Map(const Map& x) : super(x) {}
		Map(const Map& x, const allocator_type& alloc) : super(x, alloc) {}
		Map(Map&& x) : super(move(x)) {}
		Map(Map&& x, const allocator_type& alloc) : super(move(x), alloc) {}

		Map(initializer_list<value_type> il, const key_compare& comp = key_compare(), const allocator_type& alloc = allocator_type())
			: super(il, comp, alloc) {};

		auto has(const K &key) const -> bool
		{
			return find(key) != end();
		};
		
		auto get(const K &key) const -> const T&
		{
			return super::at(key);
		};
		auto get(const K &key) -> T&
		{
			return super::at(key);
		};

		auto set(const K &key, const T &val) -> bool
		{
			return insert({ key, val }).second;
		};
		auto set(const K &key, T &&val) -> bool
		{
			return insert({ key, move(val) }).second;
		}
		auto pop(const K &key) -> T
		{
			iterator it = find(key);
			T &val = it->second;

			return move(val);
		};
	};
};