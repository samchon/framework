#pragma once

#include <vector>
#include <samchon/library/CriticalAllocator.hpp>

namespace samchon
{
	namespace library
	{
		template <typename _Ty>
		using CriticalVector = std::vector<_Ty, CriticalAllocator<_Ty>>;
	};
};