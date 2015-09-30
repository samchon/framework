#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/IEntityUniquePtrGroup.hpp>
#include <list>

namespace samchon
{
	namespace protocol
	{
		/**
		 * @brief An list of Entity(s) of std::unique_ptr
		 *
		 * @note UniqueEntityList is depreciated
		 * @author Jeongho Nam
		 */
		template <typename _Ty = Entity>
		using UniqueEntityList = 
			EntityGroup
			<
				std::list<std::unique_ptr<_Ty>>, 
				_Ty, std::unique_ptr<_Ty>
			>;
	};
};