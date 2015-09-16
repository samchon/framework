#pragma once
#include <samchon/API.hpp>

#include <vector>
#include <memory>

namespace samchon
{
	namespace library
	{
		class SAMCHON_FRAMEWORK_API XML;

		typedef std::vector<std::shared_ptr<XML>> XMLList;
	};
};