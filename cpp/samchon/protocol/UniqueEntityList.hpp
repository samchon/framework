#pragma once
#include <samchon/protocol/SamchonProtocol.hpp>

#include <samchon/protocol/IEntityUniquePtrGroup.hpp>
#include <list>

namespace samchon
{
	namespace protocol
	{
		SAMCHON_FRAMEWORK_EXTERN template class
			SAMCHON_FRAMEWORK_API IEntityUniquePtrGroup<std::list<std::unique_ptr<Entity>>>;

		typedef IEntityUniquePtrGroup<std::list<std::unique_ptr<Entity>>> UniqueEntityList;
	};
};