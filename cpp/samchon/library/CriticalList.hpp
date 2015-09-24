#pragma once

#include <list>
#include <samchon/library/CriticalAllocator.hpp>

namespace samchon
{
	namespace library
	{
		template <typename _Ty>
		using CriticalVector = std::list<_Ty, CriticalAllocator<_Ty>>;
	};
};