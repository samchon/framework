#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/IEntityUniquePtrGroup.hpp>
#include <list>

namespace samchon
{
	namespace protocol
	{
		/**
		 * @brief An EntityGroup with list container and children capsuled in unique pointers.
		 *
		 * @tparam _Ty A type of children Entity. Must be a class derived from an Entity or Entity itself.
		 *
		 * @see samchon::protocol
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