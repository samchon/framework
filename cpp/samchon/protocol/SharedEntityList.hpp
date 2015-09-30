#pragma once

#include <samchon/protocol/EntityGroup.hpp>
#include <list>

namespace samchon
{
	namespace protocol
	{
		template <typename _Ty = Entity>
		using SharedEntityList = 
			EntityGroup
			<
				std::list<std::shared_ptr<_Ty>>, 
				_Ty, std::shared_ptr<_Ty>
			>;
	};
};