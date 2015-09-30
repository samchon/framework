#pragma once

#include <samchon/protocol/EntityGroup.hpp>
#include <vector>

namespace samchon
{
	namespace protocol
	{
		/**
		 * @brief An array of Entity(s) of std::unique_ptr
		 *
		 * @note UniqueEntityArray is depreciated
		 * @author Jeongho Nam
		 */
		template <typename _Ty = Entity>
		using UniqueEntityArray = 
			EntityGroup
			<
				std::vector<std::unique_ptr<_Ty>>, 
				_Ty, std::unique_ptr<_Ty>
			>;
	};
};

/* ------------------------------------------------------------------------------
	MACROS
------------------------------------------------------------------------------ */
//HEADER
#define UNIQUE_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(CHILD_TYPE) \
auto operator[](size_t) const -> CHILD_TYPE*; \
auto at(size_t) const -> CHILD_TYPE*; \
auto get(const samchon::std::string&) const -> CHILD_TYPE*;

//BODY
#define UNIQUE_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(THIS_TYPE, CHILD_TYPE) \
auto THIS_TYPE::operator[](size_t x) const -> CHILD_TYPE* { return dynamic_cast<CHILD_TYPE*>(container_type::operator[](x).get()); }; \
auto THIS_TYPE::at(size_t x) const -> CHILD_TYPE* { return dynamic_cast<CHILD_TYPE*>(container_type::at(x).get()); }; \
auto THIS_TYPE::get(const samchon::std::string &key) const -> CHILD_TYPE* { return dynamic_cast<CHILD_TYPE*>(samchon::protocol::EntityGroup<container_type, entity_type, value_type>::get(key).get()); }