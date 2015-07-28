#pragma once

#include <string>
#include <vector>
#include <memory>
#include <samchon/Map.hpp>

namespace samchon
{
	template <typename K, typename T> class VectorMap;

	//PRE-TYPEDEFS
	template<typename C, typename T> using BasicVectorDict = VectorMap < std::basic_string<C>, T >;
	template<typename T> using VectorDict = BasicVectorDict < char, T >;
	template<typename T> using WVectorDict = BasicVectorDict < wchar_t, T >;

	template <typename K, typename T>
	class VectorMap
		: public std::vector < std::shared_ptr<T> >
	{
	private:
		typedef std::shared_ptr<T> PTR;
		typedef std::vector<PTR> super;

	protected:
		Map<K, PTR> dictionary;

	public:
		VectorMap() : super() {};
		VectorMap(size_type n) : super(n) {};
		//VectorMap(size_type n, const shared_ptr<T>& val, const allocator_type& alloc = allocator_type())
		//	: vector<shared_ptr<T>>(n, val, alloc) { dictionary.set(val->key(), val); };
		template <class InputIterator>
		VectorMap(InputIterator first, InputIterator last, const allocator_type& alloc = allocator_type()) : vector<shared_ptr<T>>(first, last, alloc) { reIndex(); };
		VectorMap(const vector& x) : super(x) { reIndex(); };
		VectorMap(const vector& x, const allocator_type& alloc) : super(x, alloc) { reIndex(); };
		VectorMap(vector&& x) : super(move(x)) { reIndex(); };
		VectorMap(vector&& x, const allocator_type& alloc) : super(move(x), alloc) { reIndex(); };
		//VectorMap(std::initializer_list<T> il, const allocator_type& alloc = allocator_type()) : vector<shared_ptr<T>>(il, alloc) { reIndex(); };

		/* ----------------------------------------------------------------
		MAP - ACCESS
		---------------------------------------------------------------- */
		auto has(const K &key) const -> bool
		{
			return dictionary.has(key);
		}
		auto get(const K &key) -> PTR&
		{
			return dictionary.get(key);
		};
		auto get(const K &key) const -> const PTR&
		{
			return dictionary.get(key);
		};

		/* ----------------------------------------------------------------
		INSERT
		---------------------------------------------------------------- */
		void push_back(const PTR &val)
		{
			super::push_back(val);
			dictionary.set(val->key(), val);
		};
		void push_back(const T *val)
		{
			PTR ptr((T *)val);
			this->push_back(ptr);
		};

		iterator insert(const_iterator position, const PTR& val)
		{
			dictionary.set(val->key(), val);
			return super::insert(position, val);
		};
		iterator insert(const_iterator position, size_type n, const PTR& val)
		{
			dictionary.set(val->key(), val);
			return super::insert(position, val);
		};
		template <class InputIterator>
		iterator insert(const_iterator position, InputIterator first, InputIterator last)
		{
			for (auto it = first; it != last; it++)
				dictionary.set((*it)->key(), *it);
			return super::insert(position, first, last);
		};
		iterator insert(const_iterator position, PTR&& val)
		{
			dictionary.set(val->key(), val);
			return super::insert(position, val);
		};
		/*iterator insert(const_iterator position, initializer_list<PTR> il)
		{
		for (auto it = il.begin(); it != il.end(); it++)
		dictionary.set(it->key(), *it);
		return vector<shared_ptr<T>>::insert(position, il);
		};*/

		/* ----------------------------------------------------------------
		DELETE
		---------------------------------------------------------------- */
		void pop_back()
		{
			iterator it = --end();
			dictionary.erase(it->get()->key());
			super::pop_back();
		};
		iterator erase(const K& key)
		{
			iterator it = end();
			for (size_t i = 0; i < size(); i++)
				if (at(i)->key() == key)
				{
					it = begin() + i;
					break;
				}
			return erase(it);
		};
		iterator erase(iterator position)
		{
			dictionary.erase((*position)->key());
			return super::erase(position);
		};
		iterator erase(iterator first, iterator last)
		{
			for (iterator it = first; it != last; it++)
				dictionary.erase((*it)->key());
			return super::erase(first, last);
		};

	protected:
		void reIndex()
		{
			dictionary.clear();
			for (size_t i = 0; i < size(); i++)
				dictionary.set(at(i)->key(), at(i));
		};
	};
};