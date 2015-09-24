#pragma once
#include <samchon/library/CriticalMap.hpp>

namespace samchon
{
	namespace library
	{
		template <typename _Ty, typename _Pr = std::less<std::string>>
		using CriticalDictionary = CriticalMap<std::string, _Ty, _Pr>;
	};
};