#pragma once
#include <samchon\API.hpp>

#include <samchon/protocol/IEntityPtrGroup.hpp>
#include <list>

namespace samchon
{
	namespace protocol
	{
		SAMCHON_FRAMEWORK_EXTERN template class
			SAMCHON_FRAMEWORK_API IEntityPtrGroup<std::list<Entity*>>;

		typedef IEntityPtrGroup<std::list<Entity*>> EntityList;
	};
};