#pragma once

#include <samchon/protocol/EntityGroup.hpp>
#include <list>

namespace samchon
{
	namespace protocol
	{
		typedef EntityGroup<std::list<Entity>> EntityList;
	};
};