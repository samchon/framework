#pragma once

namespace samchon
{
	template<class T>
	class IndexPair
		: private std::pair < size_t, T >
	{
	private:
		typedef std::pair<size_t, T> super;

	public:
		IndexPair() : super() {};
		IndexPair(const size_t &index, const T& val)
			: super(index, val) {};

		auto getIndex() const -> size_t
		{
			return super::first;
		};
		auto getValue() const -> const T&
		{
			return super::second;
		};
		auto getValue() -> T&
		{
			return super::second;
		}
	};
};