#pragma once
#include <samchon/protocol/SamchonProtocol.hpp>

#include <samchon/protocol/IEntityUniquePtrGroup.hpp>
#include <list>

namespace samchon
{
	namespace protocol
	{
		 template class
			 IEntityUniquePtrGroup<std::list<std::unique_ptr<Entity>>>;

		typedef IEntityUniquePtrGroup<std::list<std::unique_ptr<Entity>>> UniqueEntityList;
	};
};