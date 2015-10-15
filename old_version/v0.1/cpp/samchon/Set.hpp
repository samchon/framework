#pragma once

#include <set>

namespace samchon
{
	using namespace std;

	template <typename K, typename O = less<K>, typename Alloc = allocator<K>>
	class Set : public set<K, O, Alloc>
	{
	private:
		typedef set<K, O, Alloc> super;

	public:
		/*Set : set(K, O, Alloc) {};
		using super::set();*/

		explicit Set(const key_compare& comp = key_compare(), const allocator_type& alloc = allocator_type())
			: super(comp, alloc) {};
		explicit Set(const allocator_type& alloc)
			: super(alloc) {};

		template <class InputIterator>
		Set(InputIterator first, InputIterator last, const key_compare& comp = key_compare(), const allocator_type& = allocator_type())
			: super(first, last, comp, allocator_type) {};

		Set(const set& x)
			: super(x) {};
		Set(const set& x, const allocator_type& alloc)
			: super(x, alloc) {};
		Set(set&& x)
			: super(move(x)) {};
		Set(set&& x, const allocator_type& alloc)
			: super(move(x), alloc) {};
		Set(initializer_list<value_type> il, const key_compare& comp = key_compare(), const allocator_type& alloc = allocator_type())
			: super(il, comp, alloc) {};

		auto has(const K &key) const -> bool
		{
			return !(find(key) == end());
		}
	};
}