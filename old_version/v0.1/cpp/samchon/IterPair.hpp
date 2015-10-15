#pragma once

namespace samchon
{
	template <typename T>
	class IterPair
	{
	protected:
		T value;
		size_t index;
	public:
		IterPair(const T &value, size_t index)
		{
			this->value = value;
			this->index = index;
		};

		inline auto getValue() -> T
		{
			return value;
		};
		inline auto getIndex() -> size_t
		{
			return index;
		};
	};
};