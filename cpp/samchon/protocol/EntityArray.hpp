#pragma once
#include <samchon\API.hpp>

#include <samchon/protocol/IEntityGroup.hpp>
#include <vector>

namespace samchon
{
	namespace protocol
	{
		SAMCHON_FRAMEWORK_EXTERN template class SAMCHON_FRAMEWORK_API IEntityGroup<std::vector<Entity*>>;

		typedef IEntityGroup<std::vector<Entity*>> EntityArray;
	};
};

/* ------------------------------------------------------------------------------
	MACROS
------------------------------------------------------------------------------ */
//HEADER
#define ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(CHILD_TYPE) \
auto operator[](size_t) const -> CHILD_TYPE*; \
auto at(size_t) const -> CHILD_TYPE*; \
auto get(const samchon::String&) const -> CHILD_TYPE*;

//BODY
#define ENTITY_ARRAY_ELEMENT_ACCESSOR_BODY(THIS_TYPE, CHILD_TYPE) \
auto THIS_TYPE::operator[](size_t x) const -> CHILD_TYPE* { return dynamic_cast<CHILD_TYPE*>(samchon::protocol::EntityArray::operator[](x)); }; \
auto THIS_TYPE::at(size_t x) const -> CHILD_TYPE* { return dynamic_cast<CHILD_TYPE*>(samchon::protocol::EntityArray::at(x)); }; \
auto THIS_TYPE::get(const samchon::String &key) const -> CHILD_TYPE* { return dynamic_cast<CHILD_TYPE*>(samchon::protocol::EntityArray::get(key)); }