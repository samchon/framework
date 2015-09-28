#pragma once

#include <vector>
#include <samchon/library/CriticalAllocator.hpp>

namespace samchon
{
	namespace library
	{
		/**
		 * @brief A std::vector ensures concurrency.
		 *
		 * @see CriticalAllocator
		 * @author Jeongho Nam
		 */
		template <typename _Ty>
		using CriticalVector = std::vector<_Ty, CriticalAllocator<_Ty>>;
	};
};