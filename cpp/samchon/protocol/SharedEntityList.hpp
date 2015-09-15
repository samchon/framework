#pragma once

#include <samchon/protocol/EntityGroup.hpp>
#include <list>

namespace samchon
{
	namespace protocol
	{
		typedef EntityGroup<std::list<std::shared_ptr<Entity>>> SharedEntityList;
	};
};