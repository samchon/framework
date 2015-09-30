#pragma once

#include <samchon/protocol/EntityGroup.hpp>
#include <vector>

namespace samchon
{
	namespace protocol
	{
		template <typename _Ty = Entity>
		using SharedEntityArray = 
			EntityGroup
			<
				std::vector<std::shared_ptr<_Ty>>, 
				_Ty, std::shared_ptr<_Ty>
			>;
	};
};

/* ------------------------------------------------------------------------------
	MACROS
------------------------------------------------------------------------------ */
//HEADER
#define SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(CHILD_TYPE) \
auto operator[](size_t) const -> std::shared_ptr<CHILD_TYPE>; \
auto at(size_t) const -> std::shared_ptr<CHILD_TYPE>; \
auto get(const std::string&) const -> std::shared_ptr<CHILD_TYPE>;

//BODY
#define SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(THIS_TYPE, CHILD_TYPE) \
auto THIS_TYPE::operator[](size_t x) const -> std::shared_ptr<CHILD_TYPE> { return std::dynamic_pointer_cast<CHILD_TYPE>(container_type::operator[](x)); }; \
auto THIS_TYPE::at(size_t x) const -> std::shared_ptr<CHILD_TYPE> { return std::dynamic_pointer_cast<CHILD_TYPE>(container_type::at(x)); }; \
auto THIS_TYPE::get(const std::string &key) const -> std::shared_ptr<CHILD_TYPE> { return std::dynamic_pointer_cast<CHILD_TYPE>(samchon::protocol::EntityGroup<container_type, entity_type, value_type>::get(key)); }