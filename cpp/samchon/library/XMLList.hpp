#pragma once
#include <vector>
#include <memory>

namespace samchon
{
	namespace library
	{
		class XML;

		typedef std::vector<std::shared_ptr<XML>> XMLList;
	};
};