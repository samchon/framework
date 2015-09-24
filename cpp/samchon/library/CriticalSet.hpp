#pragma once

#include <samchon/Set.hpp>
#include <samchon/library/CriticalAllocator.hpp>

namespace samchon
{
	namespace library
	{
		template <typename _Ty, typename _Pr = std::less<_Ty>>
		using CriticalSet = Set<_Ty, _Pr, CriticalAllocator<_Ty>>;
	};
};