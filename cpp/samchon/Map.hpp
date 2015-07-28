#pragma once

#include <map>

namespace samchon
{
	template <typename _Kty, typename _Ty, typename _Pr = std::less<_Kty>, typename _Alloc = std::allocator<std::pair<const _Kty, _Ty>>>
	class Map
		: public std::map < _Kty, _Ty, _Pr, _Alloc >
	{
	private:
		typedef std::map<_Kty, _Ty, _Pr, _Alloc> super;

		inline auto at(const _Kty &key) const -> const _Ty&
		{
			return super::at(key);
		};
		inline auto at(const _Kty &key) -> _Ty&
		{
			return super::at(key);
		};

	public:
		using super::super;

		auto has(const _Kty &key) const -> bool
		{
			return find(key) != end();
		};
		auto get(const _Kty &key) const -> const _Ty&
		{
			return super::at(key);
		};
		auto get(const _Kty &key) -> _Ty&
		{
			return super::at(key);
		};

		auto set(const _Kty &key, const _Ty &val) -> bool
		{
			return insert({ key, val }).second;
		};
		auto set(const _Kty &key, _Ty &&val) -> bool
		{
			return insert({ key, std::move(val) }).second;
		};
		auto pop(const _Kty &key) -> _Ty
		{
			iterator it = find(key);
			_Ty &val = it->second;

			return std::move(val);
		};
	};
};