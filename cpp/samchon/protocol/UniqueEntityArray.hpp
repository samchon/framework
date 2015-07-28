#pragma once
#include <samchon/protocol/SamchonProtocol.hpp>

#include <samchon/protocol/IEntityUniquePtrGroup.hpp>
#include <vector>

namespace samchon
{
	namespace protocol
	{
		SAMCHON_FRAMEWORK_EXTERN template class
			SAMCHON_FRAMEWORK_API IEntityUniquePtrGroup<std::vector<std::unique_ptr<Entity>>>;

		typedef IEntityUniquePtrGroup<std::vector<std::unique_ptr<Entity>>> UniqueEntityArray;
	};
};

/* ------------------------------------------------------------------------------
	MACROS
------------------------------------------------------------------------------ */
// HEADER
// #define UNIQUE_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(CHILD_TYPE) \
// auto operator[](size_t) const -> CHILD_TYPE*; \
// auto at(size_t) const -> CHILD_TYPE*; \
// auto get(const samchon::String&) const -> CHILD_TYPE*;
// 
// BODY
// #define UNIQUE_ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(THIS_TYPE, CHILD_TYPE) \
// auto THIS_TYPE::operator[](size_t x) const -> CHILD_TYPE* { return dynamic_cast<CHILD_TYPE*>(samchon::protocol::UniqueEntityArray::operator[](x).get()); }; \
// auto THIS_TYPE::at(size_t x) const -> CHILD_TYPE* { return dynamic_cast<CHILD_TYPE*>(samchon::protocol::UniqueEntityArray::at(x).get()); }; \
// auto THIS_TYPE::get(const samchon::String &key) const -> CHILD_TYPE* { return dynamic_cast<CHILD_TYPE*>(samchon::protocol::UniqueEntityArray::get(key).get()); }