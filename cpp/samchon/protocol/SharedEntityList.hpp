#pragma once
#include <samchon\API.hpp>

#include <samchon/protocol/IEntitySharedPtrGroup.hpp>
#include <list>

namespace samchon
{
	namespace protocol
	{
		SAMCHON_FRAMEWORK_EXTERN template class
			SAMCHON_FRAMEWORK_API IEntitySharedPtrGroup<std::list<std::shared_ptr<Entity>>>;

		typedef IEntitySharedPtrGroup<std::list<std::shared_ptr<Entity>>> SharedEntityList;
	};
};